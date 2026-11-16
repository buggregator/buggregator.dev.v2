local http_client = require("http_client")
local json = require("json")
local store = require("store")
local logger = require("logger")
local env = require("env")

local STORE_ID = "app:state_store"
local POLL_INTERVAL = "1h"

local function get_github_headers()
    local headers = {
        ["Accept"] = "application/vnd.github+json",
        ["X-GitHub-Api-Version"] = "2022-11-28",
        ["User-Agent"] = "buggregator-app",
    }

    local token, _ = env.get("GITHUB_TOKEN")
    if token and token ~= "" then
        headers["Authorization"] = "Bearer " .. token
    end

    return headers
end

local function fetch_repo_info(log, repo)
    local headers = get_github_headers()

    local resp, err = http_client.get("https://api.github.com/repos/" .. repo, {
        headers = headers,
    })
    if err then
        log:error("failed to fetch repo info", { error = tostring(err), repo = repo })
        return nil
    end
    if resp.status_code ~= 200 then
        log:error("github api error", { status = resp.status_code, repo = repo })
        return nil
    end

    local data = json.decode(resp.body)
    return {
        stars = data.stargazers_count or 0,
        forks = data.forks_count or 0,
        open_issues = data.open_issues_count or 0,
        description = data.description or "",
    }
end

local function fetch_latest_release(log, repo)
    local headers = get_github_headers()

    local resp, err = http_client.get("https://api.github.com/repos/" .. repo .. "/releases/latest", {
        headers = headers,
    })
    if err then
        log:warn("failed to fetch latest release", { error = tostring(err), repo = repo })
        return nil
    end
    if resp.status_code == 404 then
        log:warn("no releases found", { repo = repo })
        return false
    end
    if resp.status_code ~= 200 then
        log:warn("latest release api error", { status = resp.status_code, repo = repo })
        return nil
    end

    local data = json.decode(resp.body)
    local version = data.tag_name or ""
    -- Strip leading "v" prefix
    if string.sub(version, 1, 1) == "v" then
        version = string.sub(version, 2)
    end

    return {
        version = version,
        url = data.html_url or "",
        published_at = data.published_at or "",
    }
end

local function fetch_all_releases(log, repo)
    local headers = get_github_headers()

    local resp, err = http_client.get("https://api.github.com/repos/" .. repo .. "/releases?per_page=100", {
        headers = headers,
    })
    if err then
        log:warn("failed to fetch releases", { error = tostring(err), repo = repo })
        return nil
    end
    if resp.status_code ~= 200 then
        log:warn("releases api error", { status = resp.status_code, repo = repo })
        return nil
    end

    local data = json.decode(resp.body)
    local total_downloads = 0
    local releases = {}

    for _, release in ipairs(data) do
        local release_downloads = 0
        if release.assets then
            for _, asset in ipairs(release.assets) do
                release_downloads = release_downloads + (asset.download_count or 0)
            end
        end
        total_downloads = total_downloads + release_downloads

        local tag = release.tag_name or ""
        if string.sub(tag, 1, 1) == "v" then
            tag = string.sub(tag, 2)
        end

        table.insert(releases, {
            tag = tag,
            name = release.name or tag,
            date = release.published_at or "",
            downloads = release_downloads,
        })
    end

    return total_downloads, releases
end

local function fetch_contributors(log, repo)
    local headers = get_github_headers()

    local resp, err = http_client.get("https://api.github.com/repos/" .. repo .. "/contributors?per_page=100", {
        headers = headers,
    })
    if err then
        log:warn("failed to fetch contributors", { error = tostring(err), repo = repo })
        return nil
    end
    if resp.status_code ~= 200 then
        log:warn("contributors api error", { status = resp.status_code, repo = repo })
        return nil
    end

    local data = json.decode(resp.body)
    local contributors = {}
    for _, c in ipairs(data) do
        table.insert(contributors, {
            login = c.login or "",
            avatar_url = c.avatar_url or "",
            html_url = c.html_url or "",
            contributions = c.contributions or 0,
        })
    end

    return contributors
end

local function broadcast(topic, data)
    local hub_pid = process.registry.lookup("ws_hub")
    if hub_pid then
        process.send(hub_pid, "ws.broadcast", {
            topic = topic,
            data = data,
        })
    end
end

local function get_cached(slug)
    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        return nil
    end
    local raw = cache:get("github:repo:" .. slug)
    cache:release()
    if raw then
        return json.decode(tostring(raw))
    end
    return nil
end

local function save_cached(log, slug, result)
    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        return
    end
    cache:set("github:repo:" .. slug, json.encode(result), 0)
    cache:release()
end

local function fetch_and_cache(log, slug, repo)
    log:info("fetching github data", { repo = repo })

    local repo_info = fetch_repo_info(log, repo)
    local release = fetch_latest_release(log, repo)
    local contributors = fetch_contributors(log, repo)
    local total_downloads, releases = fetch_all_releases(log, repo)

    -- A failed request (rate limit, 403, timeout) returns nil: keep what is
    -- cached for that part instead of writing zeros, which the repo cards and
    -- the stats history would show as a drop.
    local cached = get_cached(slug) or {}
    local failed = {}

    local result = {
        slug = slug,
        repo = repo,
    }

    if repo_info then
        result.stars = repo_info.stars
        result.forks = repo_info.forks
        result.open_issues = repo_info.open_issues
        result.description = repo_info.description
    else
        table.insert(failed, "repo")
        result.stars = cached.stars or 0
        result.forks = cached.forks or 0
        result.open_issues = cached.open_issues or 0
        result.description = cached.description or ""
    end

    if release == nil then
        table.insert(failed, "latest_release")
        result.latest_version = cached.latest_version
        result.latest_version_url = cached.latest_version_url
        result.published_at = cached.published_at
    elseif release then
        result.latest_version = release.version
        result.latest_version_url = release.url
        result.published_at = release.published_at
    end

    if contributors then
        result.contributors = contributors
    else
        table.insert(failed, "contributors")
        result.contributors = cached.contributors or {}
    end

    if total_downloads then
        result.total_downloads = total_downloads
        result.releases = releases
    else
        table.insert(failed, "releases")
        result.total_downloads = cached.total_downloads or 0
        result.releases = cached.releases or {}
    end

    save_cached(log, slug, result)

    if #failed > 0 then
        log:warn("github fetch failed, kept cached values", {
            repo = repo,
            parts = table.concat(failed, ","),
        })
    end

    log:info("cached github data", {
        repo = repo,
        stars = result.stars,
        version = result.latest_version or "none",
        contributors = #result.contributors,
        downloads = result.total_downloads,
    })
end

local function monitor_repo(slug, repo)
    local log = logger:named("github." .. slug)
    local inbox = process.inbox()

    process.registry.register("github_" .. slug)
    log:info("repo monitor started", { repo = repo })

    -- Initial fetch
    fetch_and_cache(log, slug, repo)

    local ticker = time.ticker(POLL_INTERVAL)
    local tick_ch = ticker:response()

    while true do
        local r = channel.select({
            inbox:case_receive(),
            tick_ch:case_receive(),
        })

        if r.channel == inbox then
            local msg = r.value
            local topic = msg:topic()

            if topic == "stop" then
                ticker:stop()
                break

            elseif topic == "webhook.star" then
                local data = msg:payload()
                if type(data) == "userdata" then
                    local d, _ = data:data()
                    data = d
                end

                if data then
                    local stars = data.stars
                    log:info("webhook: star event", { action = data.action, stars = stars })

                    -- Update stars in cache
                    local cached = get_cached(slug)
                    if cached and stars then
                        cached.stars = stars
                        save_cached(log, slug, cached)
                    end

                    -- Broadcast to frontend
                    broadcast("github.stars", {
                        slug = slug,
                        stars = stars,
                    })
                end

            elseif topic == "webhook.release" then
                local data = msg:payload()
                if type(data) == "userdata" then
                    local d, _ = data:data()
                    data = d
                end

                if data then
                    log:info("webhook: release event", { version = data.version })

                    -- Update release in cache
                    local cached = get_cached(slug)
                    if cached then
                        cached.latest_version = data.version
                        cached.latest_version_url = data.url
                        cached.published_at = data.published_at
                        save_cached(log, slug, cached)
                    end

                    -- Broadcast to frontend
                    broadcast("github.release", {
                        slug = slug,
                        version = data.version,
                        url = data.url,
                        published_at = data.published_at,
                    })
                end
            end
        else
            fetch_and_cache(log, slug, repo)
        end
    end

    return 0
end

return {
    server_main = function() return monitor_repo("server", "buggregator/server") end,
    frontend_main = function() return monitor_repo("frontend", "buggregator/frontend") end,
    trap_main = function() return monitor_repo("trap", "buggregator/trap") end,
    plugin_main = function() return monitor_repo("plugin", "buggregator/phpstorm-plugin") end,
}
