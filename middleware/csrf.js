const { csrfSync } = require("csrf-sync");

const {
    csrfSynchronisedProtection,
    generateToken
} = csrfSync({
    getTokenFromRequest: (req) => {
        // Form submission
        if (req.is("application/x-www-form-urlencoded")) {
            return req.body.csrfToken;
        }

        // JSON/API requests
        return req.headers["x-csrf-token"];
    }
});

module.exports = {
    csrfSynchronisedProtection,
    generateToken
};