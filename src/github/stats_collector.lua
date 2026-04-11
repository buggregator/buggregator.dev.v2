local json = require("json")
local store = require("store")
local logger = require("logger")

local log = logger:named("github.stats")

local STORE_ID = "app:state_store"
local HISTORY_KEY = "github:stats:history"
local POLL_INTERVAL = "24h"
local MAX_ENTRIES = 365

local REPO_SLUGS = { "server", "frontend", "trap", "plugin" }

local function today()
    return os.date("!%Y-%m-%d")
end

local function collect_snapshot()
    log:info("collecting daily stats snapshot")

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        return
    end

    -- Gather current stars
    local total_stars = 0
    for _, slug in ipairs(REPO_SLUGS) do
        local raw = cache:get("github:repo:" .. slug)
        if raw then
            local data = json.decode(tostring(raw))
            total_stars = total_stars + (tonumber(data.stars) or 0)
        end
    end

    -- Get downloads breakdown from downloads collector
    local server_downloads = 0
    local trap_downloads = 0
    local raw_downloads = cache:get("github:downloads")
    if raw_downloads then
        local dl = json.decode(tostring(raw_downloads))
        -- Server = Docker pulls + GitHub Releases
        server_downloads = (dl.docker_pulls or 0) + (dl.github_releases and dl.github_releases.total or 0)
        -- Trap = Packagist
        if dl.packagist and dl.packagist.trap then
            trap_downloads = dl.packagist.trap.total or 0
        end
    end

    if total_stars == 0 then
        cache:release()
        log:warn("no data available yet, skipping snapshot")
        return
    end

    -- Load existing history
    local history = {}
    local raw_history = cache:get(HISTORY_KEY)
    if raw_history then
        local decoded = json.decode(tostring(raw_history))
        if decoded and decoded.entries then
            history = decoded.entries
        end
    end

    -- Deduplicate: replace if today already exists
    local date = today()
    local entry_data = {
        date = date,
        total_stars = total_stars,
        server_downloads = server_downloads,
        trap_downloads = trap_downloads,
    }

    local found = false
    for i, entry in ipairs(history) do
        if entry.date == date then
            history[i] = entry_data
            found = true
            break
        end
    end

    if not found then
        table.insert(history, entry_data)
    end

    -- Trim to max entries (keep most recent)
    while #history > MAX_ENTRIES do
        table.remove(history, 1)
    end

    -- Save back
    cache:set(HISTORY_KEY, json.encode({ entries = history }), 0)
    cache:release()

    log:info("stats snapshot saved", {
        date = date,
        total_stars = total_stars,
        server_downloads = server_downloads,
        trap_downloads = trap_downloads,
        entries = #history,
    })
end

local function main()
    local inbox = process.inbox()
    process.registry.register("github_stats")

    log:info("stats collector started")

    -- Wait for repo monitors to complete initial fetch
    local init_timer = time.timer("60s")
    init_timer:response():receive()

    -- Initial snapshot
    collect_snapshot()

    -- Daily ticker
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
            collect_snapshot()
        end
    end

    return 0
end

return { main = main }
