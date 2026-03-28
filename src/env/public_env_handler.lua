local http = require("http")
local env = require("env")

local function handler()
    local res = http.response()

    local all_env_vars, err = env.get_all()
    if err then
        res:set_header("Content-Type", "text/javascript")
        res:set_status(500)
        res:write("const __WIPPY_ENV__ = {};")
        return
    end

    local public_vars = {}
    for var_name, var_value in pairs(all_env_vars) do
        if string.match(var_name, "^PUBLIC_") then
            public_vars[var_name] = var_value
        end
    end

    local js_lines = {
        "const __WIPPY_ENV__ = {"
    }

    local var_count = 0
    local total_vars = 0
    for _ in pairs(public_vars) do
        total_vars = total_vars + 1
    end

    for name, value in pairs(public_vars) do
        var_count = var_count + 1
        local escaped_value = string.gsub(value, "\\", "\\\\")
        escaped_value = string.gsub(escaped_value, "'", "\\'")
        escaped_value = string.gsub(escaped_value, "\"", "\\\"")
        escaped_value = string.gsub(escaped_value, "\n", "\\n")
        escaped_value = string.gsub(escaped_value, "\r", "\\r")
        escaped_value = string.gsub(escaped_value, "\t", "\\t")

        table.insert(js_lines, "  " .. name .. ": \"" .. escaped_value .. "\"" .. (var_count < total_vars and "," or ""))
    end

    table.insert(js_lines, "};")

    local js_content = table.concat(js_lines, "\n")

    res:set_header("Content-Type", "text/javascript")
    res:set_status(200)
    res:write(js_content)
end

return {
    handler = handler
}
