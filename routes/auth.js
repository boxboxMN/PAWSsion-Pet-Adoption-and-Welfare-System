// routes/auth.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const authController = require("../controllers/authController");

// Configure secure storage
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        // Generate a cryptographically secure random name to prevent collisions and directory traversal
        const randomName = crypto.randomBytes(16).toString("hex");
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${randomName}${extension}`);
    }
});

// Configure file filtering and limits
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed."));
        }
    }
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// ==========================================
// REAL-TIME EMAIL AVAILABILITY CHECK ROUTE
// ==========================================
router.get("/check-email", authController.checkEmailAvailability);
router.get("/check-org-name", authController.checkOrgNameAvailability);

router.post(
    "/register-organization",
    (req, res, next) => {
        upload.single("document")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred (e.g., file too large)
                return res.status(400).send(err.message);
            } else if (err) {
                // An custom error occurred (e.g., wrong file extension)
                return res.status(400).send(err.message);
            }
            next();
        });
    },
    authController.registerOrganization
);

console.log("Organization route loaded");

module.exports = router;