const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const userController = require("../controllers/userController");
const matchmakerController = require("../controllers/matchmakerController");
const { matchPets } = require("../controllers/matchmakerController");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/avatars/"; 
        
    
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        cb(null, dir); 
    },
    filename: function (req, file, cb) {
        const accountId = req.session?.accountId || "unknown";
        cb(null, `avatar-${accountId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    }
});
router.get("/api/pets", userController.getAvailablePets);
// ==========================================
// USER PAGE VIEW ROUTES (HTML Files)
// ==========================================
router.post(
    "/api/matchmaking",
    matchmakerController.matchPets
);

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
router.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/user/userProfile.html"));
}); 

// ==========================================
// DYNAMIC PROFILE DATA API ENDPOINTS
// ==========================================

router.get("/api/user/profile", userController.getProfile);
router.post("/api/user/profile/update", userController.updateProfile);
router.post("/api/user/profile/password", userController.updatePassword);
router.post("/api/user/profile/avatar", upload.single("avatar"), userController.updateAvatar);

module.exports = router;