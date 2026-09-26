// middleware/singleSessionGuard.js
const pool = require("../config/database");

/**
 * SINGLE ACTIVE SESSION ENFORCEMENT
 * 
 * Checks if the current session ID matches the one stored in the DB.
 * If they don't match → another device logged in → force logout this session.
 * 
 * Skips:
 *  - Routes na walang session (login, logout, csrf)
 *  - Public endpoints
 *  - /api/session-status (para hindi mag-loop)
 */
module.exports = async function singleSession(req, res, next) {
    // Walang session → hayaan ang ibang middleware ang humawak
    if (!req.session || !req.session.accountId) {
        return next();
    }

    // Skip sa auth routes (para hindi mag-loop)
    const skipPaths = [
        "/auth/login",
        "/auth/logout",
        "/auth/csrf-token",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/api/session-status"
    ];
    if (skipPaths.some(p => req.originalUrl.startsWith(p))) {
        return next();
    }

    try {
        const [rows] = await pool.query(
            `SELECT current_session_id FROM accounts WHERE account_id = ? LIMIT 1`,
            [req.session.accountId]
        );

        // Wala na ang account → destroy
        if (!rows.length) {
            req.session.destroy(() => {});
            return handleUnauthorized(req, res, "session_expired");
        }

        const dbSessionId = rows[0].current_session_id;

        // Walang naka-record → baka bagong login pa lang, hayaan muna
        if (!dbSessionId) {
            return next();
        }

        // ✅ Match → valid session, tuloy lang
        if (dbSessionId === req.sessionID) {
            return next();
        }

        // ❌ Hindi match → ibang device ang latest → force logout dito
        console.log(`[SAS] Session mismatch for account ${req.session.accountId}`);
        console.log(`     DB has: ${dbSessionId}`);
        console.log(`     Req has: ${req.sessionID}`);
        console.log(`     → Forcing logout of this session.`);

        req.session.destroy(() => {});
        return handleUnauthorized(req, res, "logged_in_elsewhere");
    } catch (err) {
        console.error("[SAS] Error:", err);
        // Fail open — huwag i-block ang user kung may DB error
        next();
    }
};

function handleUnauthorized(req, res, reason) {
    const isApi = req.originalUrl.startsWith("/api/") ||
                  req.xhr ||
                  req.headers.accept?.includes("application/json");

    if (isApi) {
        return res.status(401).json({
            success: false,
            message: reason === "logged_in_elsewhere"
                ? "You have been logged out because your account was signed in on another device."
                : "Session expired. Please log in again.",
            reason,
            redirect: "/auth/login"
        });
    }

    return res.redirect(`/auth/login?reason=${reason}`);
}