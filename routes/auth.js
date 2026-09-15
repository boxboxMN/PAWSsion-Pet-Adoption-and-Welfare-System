// routes/auth.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const authController = require("../controllers/AuthController");

const {
    csrfSynchronisedProtection,
    generateToken
} = require("../middleware/csrf");

console.log("AUTH ROUTES CHECK:");
console.log("forgotPassword:", typeof authController.forgotPassword);
console.log("resetPassword:", typeof authController.resetPassword);


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const storage = multer.diskStorage({
    destination: "uploads/",

    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(16).toString("hex");
        const extension = path.extname(file.originalname).toLowerCase();

        cb(null, `${randomName}${extension}`);
    }
});

const upload = multer({
    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },

    fileFilter: (req, file, cb) => {
        const allowedExtensions = [
            ".pdf",
            ".jpg",
            ".jpeg",
            ".png"
        ];

        const ext = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed."
                )
            );
        }
    }
});


// ==========================================
// LOGIN PAGE
// ==========================================

router.get("/login", (req, res) => {
    const loginPath = path.join(
        __dirname,
        "../public/auth/login.html"
    );

    fs.readFile(loginPath, "utf8", (err, html) => {
        if (err) {
            console.error("Error loading login page:", err);
            return res
                .status(500)
                .send("Unable to load login page.");
        }

        const csrfToken = generateToken(req);
            const htmlWithCsrf = html.replace(
    /<input\s+type="hidden"\s+name="csrfToken"\s+value="">/i,
    `<input type="hidden" name="csrfToken" value="${csrfToken}">`
);

        res.send(htmlWithCsrf);
    });
});


// ==========================================
// CREATE ACCOUNT PAGE
// ==========================================

router.get("/create-account", (req, res) => {
    const createAccountPath = path.join(
        __dirname,
        "../public/auth/create_account.html"
    );

    fs.readFile(createAccountPath, "utf8", (err, html) => {
        if (err) {
            console.error(
                "Error loading create account page:",
                err
            );

            return res
                .status(500)
                .send("Unable to load create account page.");
        }

        const csrfToken = generateToken(req);

        const htmlWithCsrf = html.replace(
    /<input\s+type="hidden"\s+name="csrfToken"\s+value="">/i,
    `<input type="hidden" name="csrfToken" value="${csrfToken}">`
);

        res.send(htmlWithCsrf);
    });
});


// ==========================================
// ORGANIZATION SIGNUP PAGE
// ==========================================

router.get("/organization-signup", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "../public/auth/organization_signup.html"
        )
    );
});


// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

router.post(
    "/register",
    authController.register
);

router.post(
    "/login",
    csrfSynchronisedProtection,
    authController.login
);

router.post(
    "/logout",
    authController.logout
);

router.post(
    "/forgot-password",
    authController.forgotPassword
);

router.post(
    "/reset-password",
    authController.resetPassword
);


// ==========================================
// REAL-TIME AVAILABILITY CHECK
// ==========================================

router.get(
    "/check-email",
    authController.checkEmailAvailability
);

router.get(
    "/check-org-name",
    authController.checkOrgNameAvailability
);


// ==========================================
// ORGANIZATION REGISTRATION
// ==========================================

router.post(
    "/register-organization",

    (req, res, next) => {
        upload.single("document")(req, res, (err) => {

            if (err instanceof multer.MulterError) {
                // Multer error such as file too large
                return res.status(400).send(err.message);
            }

            if (err) {
                // Custom file validation error
                return res.status(400).send(err.message);
            }

            next();
        });
    },

    authController.registerOrganization
);


console.log("Organization route loaded");

module.exports = router;