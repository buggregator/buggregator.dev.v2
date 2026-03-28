local http = require("http")
local json = require("json")
local store = require("store")
local logger = require("logger")

local log = logger:named("github.api")

local STORE_ID = "app:state_store"
local REPO_SLUGS = { "server", "frontend", "trap", "plugin" }

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

    cache:release()

    res:set_header("Cache-Control", "public, max-age=300")
    return res:write_json({
        repos = repos,
        total_stars = total_stars,
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

return {
    repos = repos,
    contributors = contributors,
}
