local json   = require("json")
local store  = require("store")
local logger = require("logger")

local log = logger:named("ws.hub")

-- Decode a message payload (may be userdata or table)
local function decode_payload(msg)
    local raw = msg:payload()
    if type(raw) == "userdata" then
        local data, err = raw:data()
        if err then
            log:error("payload decode error", { error = tostring(err) })
            return nil
        end
        return data
    end
    return raw
end

local function main()
    local inbox = process.inbox()
    process.registry.register("ws_hub")

    -- client_pid -> true
    local clients = {}

    log:info("ws hub started")

    while true do
        local msg = inbox:receive()
        local topic = msg:topic()

        if topic == "stop" then
            break

        elseif topic == "ws.join" then
            local data = decode_payload(msg)
            if data then
                local client_pid = data.client_pid
                if client_pid then
                    clients[client_pid] = true
                    log:info("client joined")
                end
            end

        elseif topic == "ws.leave" then
            local data = decode_payload(msg)
            if data then
                local client_pid = data.client_pid
                if client_pid then
                    clients[client_pid] = nil
                    log:info("client left")
                end
            end

        elseif topic == "ws.broadcast" then
            local data = decode_payload(msg)
            if data then
                for client_pid, _ in pairs(clients) do
                    process.send(client_pid, "ws.send", {
                        type = "text",
                        data = json.encode(data),
                    })
                end
            end
        end
    end

    return 0
end

return { main = main }
