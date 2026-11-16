return require("migration").define(function()
    migration("Create mcp_sessions table for the MCP session store", function()
        database("sqlite", function()
            up(function(db)
                local _, err = db:execute([[
                    CREATE TABLE IF NOT EXISTS mcp_sessions (
                        session_id TEXT PRIMARY KEY,
                        transport TEXT NOT NULL DEFAULT '',
                        client_ip TEXT NOT NULL DEFAULT '',
                        user_agent TEXT NOT NULL DEFAULT '',
                        scope TEXT NOT NULL DEFAULT '',
                        client_name TEXT NOT NULL DEFAULT '',
                        client_version TEXT NOT NULL DEFAULT '',
                        tools_called INTEGER NOT NULL DEFAULT 0,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    )
                ]])
                if err then error("Failed to create mcp_sessions table: " .. err) end
            end)

            down(function(db)
                local _, err = db:execute("DROP TABLE IF EXISTS mcp_sessions")
                if err then error("Failed to drop mcp_sessions table: " .. err) end
            end)
        end)
    end)
end)
