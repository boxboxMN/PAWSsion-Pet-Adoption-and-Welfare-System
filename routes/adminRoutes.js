
const express = require("express");
const path = require("path");

const router = express.Router();



router.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/dashboard.html"));
});


router.get("/organization", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/organization.html"));
});


router.get("/partner-request", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/partner-request.html"));
});


router.get("/user-management", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/user-management.html"));
});


router.get("/feedback", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/feedback.html"));
});


router.get("/setting", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/setting.html"));
});


router.get("/notifications", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/admin/notifications.html"));
});

// Logout
router.get("/logout", (req, res) => {
    // Replace this with your authentication logout logic if needed
    res.redirect("/login");
});



module.exports = router;
