local http = require("http")
local env = require("env")

local function handler()
    local res = http.response()

    local all_env_vars, err = env.get_all()
    if err then
        res:set_status(500)
        return res:write_json({ error = "failed to load env" })
    end

    local public_vars = {}
    for var_name, var_value in pairs(all_env_vars) do
        if string.match(var_name, "^PUBLIC_") then
            public_vars[var_name] = var_value
        end
    end

    res:set_header("Cache-Control", "public, max-age=300")
    return res:write_json(public_vars)
end

return {
    handler = handler
}
