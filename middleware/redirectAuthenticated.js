const pool = require("../config/database");

module.exports = async function redirectAuthenticated(req, res, next) {
    // No authenticated session
    if (!req.session || !req.session.accountId) {
        return next();
    }

    try {
        const [rows] = await pool.query(
            `SELECT account_id, role, status
             FROM accounts
             WHERE account_id = ?
             LIMIT 1`,
            [req.session.accountId]
        );

        // Account no longer exists
        if (!rows.length) {
            return req.session.destroy(() => {
                res.clearCookie("connect.sid", { path: "/" });
                return res.redirect("/auth/login");
            });
        }

        const account = rows[0];

        // Check whether the account is still allowed to log in
        if (["disabled", "suspended", "banned", "rejected"].includes(account.status)) {
            return req.session.destroy(() => {
                res.clearCookie("connect.sid", { path: "/" });
                return res.redirect("/auth/login");
            });
        }

        // Keep session role updated
        req.session.role = account.role;

        // Pending organization
        if (
            account.role === "organization" &&
            account.status === "pending"
        ) {
            return res.redirect("/org/pending");
        }

        // Redirect authenticated users to their dashboard
        if (account.role === "admin") {
            return res.redirect("/admin/dashboard");
        }

        if (account.role === "organization") {
            return res.redirect("/org/dashboard");
        }

        if (account.role === "adopter") {
            return res.redirect("/dashboard");
        }

        // Unknown role
        return next();

    } catch (error) {
        console.error("[AUTH REDIRECT] Error:", error);
        return next();
    }
};