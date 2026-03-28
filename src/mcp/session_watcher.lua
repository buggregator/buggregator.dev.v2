local events_mod = require("events")
local contract = require("contract")
local logger = require("logger")

local log = logger:named("mcp_session_watcher")

local function handle_event(store, evt)
    local kind = evt.kind
    local data = evt.data or {}
    local session_id = data.session_id

    if not session_id then
        return
    end

    log:info("event received", {kind = kind, session_id = session_id})

    if kind == "session.created" then
        local _, err = store:create({
            session_id = session_id,
            transport = data.transport,
            client_ip = data.client_ip,
            user_agent = data.user_agent,
            scope = data.scope,
            client_name = data.client_name,
            client_version = data.client_version,
        })
        if err then
            log:error("failed to store session", {error = tostring(err)})
        end

    elseif kind == "protocol.initialized" then
        local _, err = store:set_client_info({
            session_id = session_id,
            client_name = data.client_name,
            client_version = data.client_version,
        })
        if err then
            log:error("failed to store client info", {error = tostring(err)})
        end

    elseif kind == "tool.called" then
        local _, err = store:touch({
            session_id = session_id,
            increment_tools = true,
        })
        if err then
            log:error("failed to record tool call", {error = tostring(err)})
        end

    elseif kind == "prompt.get" then
        store:touch({session_id = session_id})

    elseif kind == "ping" then
        store:touch({session_id = session_id})

    elseif kind == "session.destroyed" then
        local _, err = store:remove({session_id = session_id})
        if err then
            log:error("failed to remove session", {error = tostring(err)})
        end
    end
end

local function main()
    local inbox = process.inbox()

    local store, store_err = contract.open("app.mcp:mcp_session_store")
    if store_err then
        log:error("failed to open session store", {error = tostring(store_err)})
        return 1
    end

    store:clear_all()

    local sub = events_mod.subscribe("mcp")
    local event_ch = sub:channel()

    log:info("mcp session watcher started")

    while true do
        local r = channel.select({
            inbox:case_receive(),
            event_ch:case_receive(),
        })

        if r.channel == inbox then
            local msg = r.value
            if msg:topic() == "stop" then
                sub:close()
                break
            end
        elseif r.channel == event_ch then
            handle_event(store, r.value)
        end
    end

    return 0
end

return { main = main }
