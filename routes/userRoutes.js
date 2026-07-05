const express = require("express");
const path = require("path");

const router = express.Router();

// USER DASHBOARD ROUTE
router.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/userDashboard.html"));
});
router.get("/sidebar", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/userSidebar.html"));
}); 
router.get("/header", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/userHeader.html"));
});
router.get("/adoption-hub", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/adoptionHub.html"));
});

// Additional user pages
router.get("/matchmaker", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/matchmaker.html"));
});

router.get("/application", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/application.html"));
});

router.get("/donation", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/donation.html"));
});
router.get("/cash-donation", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/cash-donation.html"));
});
router.get("/inkind-donation", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/inkind-donation.html"));
});


router.get("/kamustahan", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/kamustahan.html"));
});
// USER PROFILE ROUTE
router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/userProfile.html"));
}); 
module.exports = router;
