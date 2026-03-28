local json = require("json")
local store = require("store")
local logger = require("logger")

local log = logger:named("github.contributors")

local STORE_ID = "app:state_store"
local POLL_INTERVAL = "1h"
local MAX_CONTRIBUTORS = 50

local REPO_SLUGS = { "server", "frontend", "trap", "plugin" }

local function collect_and_cache()
    log:info("aggregating contributors from all repos")

    local cache, cache_err = store.get(STORE_ID)
    if cache_err then
        log:error("failed to get store", { error = tostring(cache_err) })
        return
    end

    -- Merge contributors from all repos
    local by_login = {}

    for _, slug in ipairs(REPO_SLUGS) do
        local raw = cache:get("github:repo:" .. slug)
        if raw then
            local repo_data = json.decode(tostring(raw))
            if repo_data and repo_data.contributors then
                for _, c in ipairs(repo_data.contributors) do
                    if c.login and c.login ~= "" then
                        if by_login[c.login] then
                            by_login[c.login].contributions = (tonumber(by_login[c.login].contributions) or 0) + (tonumber(c.contributions) or 0)
                        else
                            by_login[c.login] = {
                                login = c.login,
                                avatar_url = c.avatar_url or "",
                                html_url = c.html_url or "",
                                contributions = c.contributions or 0,
                            }
                        end
                    end
                end
            end
        end
    end

    -- Sort by contributions descending
    local contributors = {}
    for _, c in pairs(by_login) do
        table.insert(contributors, c)
    end

    table.sort(contributors, function(a, b)
        return a.contributions > b.contributions
    end)

    -- Take top N
    local top = {}
    for i = 1, math.min(#contributors, MAX_CONTRIBUTORS) do
        table.insert(top, contributors[i])
    end

    cache:set("github:contributors", json.encode({ contributors = top }), 0)
    cache:release()

    log:info("cached aggregated contributors", { count = #top })
end

local function main()
    local inbox = process.inbox()
    process.registry.register("github_contributors")

    log:info("contributors collector started")

    -- Wait a bit for repo monitors to do their initial fetch
    local init_timer = time.timer("30s")
    init_timer:response():receive()

    collect_and_cache()

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
            collect_and_cache()
        end
    end

    return 0
end

return { main = main }
