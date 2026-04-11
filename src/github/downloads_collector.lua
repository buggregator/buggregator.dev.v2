local http_client = require("http_client")
local json = require("json")
local store = require("store")
local logger = require("logger")

local log = logger:named("github.downloads")

local STORE_ID = "app:state_store"
local STORE_KEY = "github:downloads"
local POLL_INTERVAL = "1h"

-- Historical pulls: 170K GHCR + 17K Docker Hub
local DOCKER_PULLS_BASELINE = 187000

local PACKAGIST_PACKAGES = {
    { slug = "trap", package = "buggregator/trap" },
}

local function fetch_packagist(pkg)
    local url = "https://packagist.org/packages/" .. pkg .. ".json"
    local resp, err = http_client.get(url, {
        headers = { ["User-Agent"] = "buggregator-app" },
    })
    if err then
        log:warn("failed to fetch packagist", { error = tostring(err), package = pkg })
        return nil
    end
    if resp.status_code ~= 200 then
        log:warn("packagist api error", { status = resp.status_code, package = pkg })
        return nil
    end

    local data = json.decode(resp.body)
    if data and data.package and data.package.downloads then
        return {
            total = data.package.downloads.total or 0,
            monthly = data.package.downloads.monthly or 0,
            daily = data.package.downloads.daily or 0,
        }
    end

    return nil
end

local function collect()
    log:info("collecting download stats")

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        return
    end

    -- Gather GitHub Release downloads per repo
    local github_downloads = {}
    local github_total = 0
    local repo_slugs = { "server", "frontend", "trap", "plugin" }

    for _, slug in ipairs(repo_slugs) do
        local raw = cache:get("github:repo:" .. slug)
        if raw then
            local data = json.decode(tostring(raw))
            local dl = tonumber(data.total_downloads) or 0
            github_downloads[slug] = dl
            github_total = github_total + dl
        end
    end

    -- Gather Packagist downloads
    local packagist = {}
    for _, pkg in ipairs(PACKAGIST_PACKAGES) do
        local stats = fetch_packagist(pkg.package)
        if stats then
            packagist[pkg.slug] = stats
            log:info("packagist stats", {
                package = pkg.package,
                total = stats.total,
                monthly = stats.monthly,
            })
        end
    end

    -- Build result
    local result = {
        docker_pulls = DOCKER_PULLS_BASELINE,
        github_releases = {
            total = github_total,
            by_repo = github_downloads,
        },
        packagist = packagist,
        total = DOCKER_PULLS_BASELINE + github_total,
    }

    -- Add packagist totals
    for _, stats in pairs(packagist) do
        result.total = result.total + (stats.total or 0)
    end

    cache:set(STORE_KEY, json.encode(result), 0)
    cache:release()

    log:info("download stats cached", { total = result.total })
end

local function main()
    local inbox = process.inbox()
    process.registry.register("github_downloads")

    log:info("downloads collector started")

    -- Wait for repo monitors to do their initial fetch
    local init_timer = time.timer("60s")
    init_timer:response():receive()

    -- Initial collection
    collect()

    -- Hourly refresh (packagist updates slowly, but keeps in sync with repo monitors)
    local ticker = time.ticker(POLL_INTERVAL)
    local tick_ch = ticker:response()

    while true do
        local r = channel.select({
            inbox:case_receive(),
            tick_ch:case_receive(),
        })

        if r.channel == inbox then
            local msg = r.value
            if msg:topic() == "stop" then
                ticker:stop()
                break
            end
        else
            collect()
        end
    end

    return 0
end

return { main = main }
