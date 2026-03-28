local http     = require("http")
local json     = require("json")

local function handler()
    local res = http.response()

    local hub_pid = process.registry.lookup("ws_hub")
    if not hub_pid then
        res:set_status(503)
        return res:write_json({ error = "hub unavailable" })
    end

    -- Set relay header — the wsrelay post-middleware handles the WS upgrade
    res:set_header("X-WS-Relay", json.encode({
        target_pid = tostring(hub_pid),
        message_topic = "ws.message",
    }))
end

return { handler = handler }
