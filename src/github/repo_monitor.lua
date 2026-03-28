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
    if resp.status_code ~= 200 then
        log:warn("no releases found", { status = resp.status_code, repo = repo })
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

local function fetch_contributors(log, repo)
    local headers = get_github_headers()

    local resp, err = http_client.get("https://api.github.com/repos/" .. repo .. "/contributors?per_page=30", {
        headers = headers,
    })
    if err then
        log:warn("failed to fetch contributors", { error = tostring(err), repo = repo })
        return {}
    end
    if resp.status_code ~= 200 then
        log:warn("contributors api error", { status = resp.status_code, repo = repo })
        return {}
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

local function fetch_and_cache(log, slug, repo)
    log:info("fetching github data", { repo = repo })

    local repo_info = fetch_repo_info(log, repo)
    local release = fetch_latest_release(log, repo)
    local contributors = fetch_contributors(log, repo)

    local result = {
        slug = slug,
        repo = repo,
        stars = repo_info and repo_info.stars or 0,
        forks = repo_info and repo_info.forks or 0,
        open_issues = repo_info and repo_info.open_issues or 0,
        description = repo_info and repo_info.description or "",
        latest_version = release and release.version or nil,
        latest_version_url = release and release.url or nil,
        published_at = release and release.published_at or nil,
        contributors = contributors,
    }

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        return
    end

    cache:set("github:repo:" .. slug, json.encode(result), 0)
    cache:release()

    log:info("cached github data", {
        repo = repo,
        stars = result.stars,
        version = result.latest_version or "none",
        contributors = #contributors,
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
            if msg:topic() == "stop" then
                ticker:stop()
                break
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
