local http = require("http")
local json = require("json")
local store = require("store")
local logger = require("logger")

local log = logger:named("github.api")

local STORE_ID = "app:state_store"
local REPO_SLUGS = { "server", "frontend", "trap", "plugin" }

local function get_downloads(cache)
    local raw = cache:get("github:downloads")
    if raw then
        return json.decode(tostring(raw))
    end
    return nil
end

local function repos()
    local res = http.response()

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        res:set_status(500)
        return res:write_json({ error = "store unavailable" })
    end

    local repos = {}
    local total_stars = 0

    for _, slug in ipairs(REPO_SLUGS) do
        local raw = cache:get("github:repo:" .. slug)
        if raw then
            local data = json.decode(tostring(raw))
            -- Exclude contributors from repo response (separate endpoint)
            data.contributors = nil
            table.insert(repos, data)
            total_stars = total_stars + (tonumber(data.stars) or 0)
        end
    end

    -- Get aggregated downloads from downloads collector
    local downloads = get_downloads(cache)

    cache:release()

    res:set_header("Cache-Control", "public, max-age=300")
    return res:write_json({
        repos = repos,
        total_stars = total_stars,
        downloads = downloads,
    })
end

local function contributors()
    local res = http.response()

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        res:set_status(500)
        return res:write_json({ error = "store unavailable" })
    end

    local raw = cache:get("github:contributors")
    cache:release()

    if not raw then
        return res:write_json({ contributors = {} })
    end

    local data = json.decode(tostring(raw))

    res:set_header("Cache-Control", "public, max-age=300")
    return res:write_json(data)
end

local function stats()
    local res = http.response()

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        res:set_status(500)
        return res:write_json({ error = "store unavailable" })
    end

    -- Current totals
    local total_stars = 0
    for _, slug in ipairs(REPO_SLUGS) do
        local raw = cache:get("github:repo:" .. slug)
        if raw then
            local data = json.decode(tostring(raw))
            total_stars = total_stars + (tonumber(data.stars) or 0)
        end
    end

    -- Downloads breakdown
    local downloads = get_downloads(cache)

    -- History
    local history = {}
    local raw_history = cache:get("github:stats:history")
    if raw_history then
        local decoded = json.decode(tostring(raw_history))
        if decoded and decoded.entries then
            history = decoded.entries
        end
    end

    cache:release()

    res:set_header("Cache-Control", "public, max-age=300")
    return res:write_json({
        total_stars = total_stars,
        downloads = downloads,
        history = history,
    })
end

return {
    repos = repos,
    contributors = contributors,
    stats = stats,
}
