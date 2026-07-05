const express = require("express");
const router = express.Router();
const multer = require("multer");

const authController = require("../controllers/authController");

const upload = multer({
    dest: "uploads/"
});

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post(
    "/register-organization",
    upload.single("document"),
    authController.registerOrganization
);

console.log("Organization route loaded");

module.exports = router;