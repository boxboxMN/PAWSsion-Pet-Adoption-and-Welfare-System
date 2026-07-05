// errors/errorHandler.js

const validator = require("validator");

class ErrorHandler {

    // Remove unnecessary spaces and escape HTML
    static sanitize(data = {}) {
        const sanitized = {};

        for (const key in data) {
            if (typeof data[key] === "string") {
                sanitized[key] = validator.escape(data[key].trim());
            } else {
                sanitized[key] = data[key];
            }
        }

        return sanitized;
    }

    // Validate login form
    static validateLogin(email, password) {

        const errors = [];

        if (!email || email.trim() === "") {
            errors.push("Email is required.");
        }

        if (!password || password.trim() === "") {
            errors.push("Password is required.");
        }

        if (email && !validator.isEmail(email)) {
            errors.push("Please enter a valid email address.");
        }

        return errors;
    }

    // Validate signup form
    static validateSignup(data) {

        const errors = [];

        if (!data.first_name || data.first_name.trim() === "")
            errors.push("First name is required.");

        if (!data.last_name || data.last_name.trim() === "")
            errors.push("Last name is required.");

        if (!data.email || data.email.trim() === "")
            errors.push("Email is required.");

        if (data.email && !validator.isEmail(data.email))
            errors.push("Please enter a valid email address.");

        if (!data.password)
            errors.push("Password is required.");

        if (data.password && data.password.length < 8)
            errors.push("Password must be at least 8 characters.");

        if (!data.confirm_password)
            errors.push("Confirm Password is required.");

        if (
            data.password &&
            data.confirm_password &&
            data.password !== data.confirm_password
        ) {
            errors.push("Passwords do not match.");
        }

        return errors;
    }

    // Wrong credentials
    static invalidEmail() {
        return {
            success: false,
            message: "Email does not exist."
        };
    }

    static invalidPassword() {
        return {
            success: false,
            message: "Incorrect password."
        };
    }

    static emailExists() {
        return {
            success: false,
            message: "Email is already registered."
        };
    }

    static accountPending() {
        return {
            success: false,
            message: "Your organization account is still under review."
        };
    }

}

module.exports = ErrorHandler;