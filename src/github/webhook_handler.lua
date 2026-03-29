local http = require("http")
local json = require("json")
local logger = require("logger")
local crypto = require("crypto")
local env = require("env")

local log = logger:named("github.webhook")

-- Map full repo names to slugs used in process registry
local REPO_MAP = {
    ["buggregator/server"] = "server",
    ["buggregator/frontend"] = "frontend",
    ["buggregator/trap"] = "trap",
    ["buggregator/phpstorm-plugin"] = "plugin",
}

--- Verify GitHub webhook signature (X-Hub-Signature-256)
local function verify_signature(secret, body, signature)
    if not secret or secret == "" then
        -- No secret configured — skip verification
        return true
    end

    if not signature or signature == "" then
        log:warn("missing webhook signature")
        return false
    end

    -- GitHub sends "sha256=<hex>"
    local expected_prefix = "sha256="
    if string.sub(signature, 1, #expected_prefix) ~= expected_prefix then
        log:warn("invalid signature format")
        return false
    end

    local expected_hex = string.sub(signature, #expected_prefix + 1)
    local computed_hex, err = crypto.hmac.sha256(secret, body)
    if err then
        log:error("hmac computation failed", { error = tostring(err) })
        return false
    end

    return crypto.constant_time_compare(computed_hex, expected_hex)
end

local function handle()
    local req = http.request()
    local res = http.response()

    local body = req:body()
    if not body or body == "" then
        res:set_status(400)
        return res:write_json({ error = "empty body" })
    end

    -- Verify signature
    local secret, _ = env.get("GITHUB_WEBHOOK_SECRET")
    local signature = req:header("X-Hub-Signature-256")

    if not verify_signature(secret, body, signature) then
        res:set_status(401)
        return res:write_json({ error = "invalid signature" })
    end

    -- Determine event type
    local event_type = req:header("X-GitHub-Event")
    if not event_type then
        res:set_status(400)
        return res:write_json({ error = "missing X-GitHub-Event header" })
    end

    -- Only process star and release events
    if event_type ~= "star" and event_type ~= "release" then
        return res:write_json({ ok = true, skipped = true })
    end

    local payload = json.decode(body)
    if not payload or not payload.repository then
        res:set_status(400)
        return res:write_json({ error = "invalid payload" })
    end

    local repo_name = payload.repository.full_name
    local slug = REPO_MAP[repo_name]

    if not slug then
        log:debug("webhook for unknown repo", { repo = repo_name })
        return res:write_json({ ok = true, skipped = true })
    end

    -- Find the monitor process for this repo
    local pid = process.registry.lookup("github_" .. slug)
    if not pid then
        log:warn("monitor process not found", { slug = slug })
        res:set_status(503)
        return res:write_json({ error = "monitor not ready" })
    end

    -- Forward event to the monitor process
    if event_type == "star" then
        local action = payload.action or ""
        log:info("star event", { repo = repo_name, action = action })
        process.send(pid, "webhook.star", {
            action = action,
            stars = payload.repository.stargazers_count,
        })

    elseif event_type == "release" then
        local action = payload.action or ""
        if action == "published" and payload.release then
            local version = payload.release.tag_name or ""
            if string.sub(version, 1, 1) == "v" then
                version = string.sub(version, 2)
            end

            log:info("release event", { repo = repo_name, version = version })
            process.send(pid, "webhook.release", {
                version = version,
                url = payload.release.html_url or "",
                published_at = payload.release.published_at or "",
            })
        end
    end

    return res:write_json({ ok = true })
end

return { handle = handle }
