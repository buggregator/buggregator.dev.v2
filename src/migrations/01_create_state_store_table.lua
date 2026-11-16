return require("migration").define(function()
    migration("Create state_store table for app:state_store", function()
        database("sqlite", function()
            up(function(db)
                local _, err = db:execute([[
                    CREATE TABLE IF NOT EXISTS state_store (
                        key TEXT PRIMARY KEY,
                        value BLOB NOT NULL,
                        expires_at INTEGER
                    )
                ]])
                if err then error("Failed to create state_store table: " .. err) end

                _, err = db:execute("CREATE INDEX IF NOT EXISTS idx_state_store_expires_at ON state_store(expires_at)")
                if err then error("Failed to create expires_at index: " .. err) end
            end)

            down(function(db)
                local _, err = db:execute("DROP TABLE IF EXISTS state_store")
                if err then error("Failed to drop state_store table: " .. err) end
            end)
        end)
    end)
end)
