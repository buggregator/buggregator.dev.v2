local sql = require("sql")
local l = require("logger")
local logger = l:named("mcp_session_store")

local DB_ID = "app:db"

local function create(input)
    local db, db_err = sql.get(DB_ID)
    if db_err then return nil, db_err end

    local _, err = sql.builder.insert("mcp_sessions")
        :set_map({
            session_id = input.session_id,
            transport = input.transport or "",
            client_ip = input.client_ip or "",
            user_agent = input.user_agent or "",
            scope = input.scope or "",
            client_name = input.client_name or "",
            client_version = input.client_version or "",
        })
        :suffix([[ON CONFLICT (session_id) DO UPDATE SET
            transport = EXCLUDED.transport,
            client_ip = EXCLUDED.client_ip,
            user_agent = EXCLUDED.user_agent,
            scope = EXCLUDED.scope,
            client_name = EXCLUDED.client_name,
            client_version = EXCLUDED.client_version]])
        :run_with(db)
        :exec()

    db:release()
    if err then
        logger:error("failed to create session", {error = tostring(err)})
        return nil, err
    end
    return {ok = true}
end

local function set_client_info(input)
    local db, db_err = sql.get(DB_ID)
    if db_err then return nil, db_err end

    local _, err = sql.builder.update("mcp_sessions")
        :set_map({client_name = input.client_name or "", client_version = input.client_version or ""})
        :set("last_activity", sql.builder.expr("CURRENT_TIMESTAMP"))
        :where({session_id = input.session_id})
        :run_with(db)
        :exec()

    db:release()
    if err then return nil, err end
    return {ok = true}
end

local function touch(input)
    local db, db_err = sql.get(DB_ID)
    if db_err then return nil, db_err end

    local q = sql.builder.update("mcp_sessions")
        :set("last_activity", sql.builder.expr("CURRENT_TIMESTAMP"))
        :where({session_id = input.session_id})
    if input.increment_tools then
        q = q:set("tools_called", sql.builder.expr("tools_called + 1"))
    end

    local _, err = q:run_with(db):exec()
    db:release()
    if err then return nil, err end
    return {ok = true}
end

local function remove(input)
    local db, db_err = sql.get(DB_ID)
    if db_err then return nil, db_err end

    local _, err = sql.builder.delete("mcp_sessions")
        :where({session_id = input.session_id})
        :run_with(db)
        :exec()
    db:release()
    if err then return nil, err end
    return {ok = true}
end

local function list()
    local db, db_err = sql.get(DB_ID)
    if db_err then return nil, db_err end

    local rows, err = sql.builder.select("*")
        :from("mcp_sessions")
        :order_by("created_at DESC")
        :run_with(db)
        :query()
    db:release()
    if err then return nil, err end
    return {sessions = rows or {}, count = #(rows or {})}
end

local function clear_all()
    local db, db_err = sql.get(DB_ID)
    if db_err then return nil, db_err end

    local _, err = sql.builder.delete("mcp_sessions")
        :run_with(db)
        :exec()
    db:release()
    if err then return nil, err end
    return {ok = true}
end

return {
    create = create,
    set_client_info = set_client_info,
    touch = touch,
    remove = remove,
    list = list,
    clear_all = clear_all,
}
