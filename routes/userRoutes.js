const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const userController = require("../controllers/userController"); 

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
// Setup Multer storage para sa Donation Receipts
const receiptStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/receipts/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        const accountId = req.session?.accountId || "guest";
        cb(null, `receipt-${accountId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadReceipt = multer({
    storage: receiptStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        }
        cb(new Error("Only images (JPG, PNG) and PDF files are allowed!"));
    }
});
router.get("/api/pets", userController.getAvailablePets);
// ==========================================
// USER PAGE VIEW ROUTES (HTML Files)
// ==========================================
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
// Add this line with your existing dynamic profile/donation routes
router.get("/api/user/donations", userController.getUserDonations);
router.get("/api/user/profile", userController.getProfile);
router.post("/api/user/profile/update", userController.updateProfile);
router.post("/api/user/profile/password", userController.updatePassword);
router.post("/api/user/profile/avatar", upload.single("avatar"), userController.updateAvatar);
router.get("/api/organizations", userController.getOrganizations);
// Route para sa Submission ng Cash Donation
router.post(
    "/api/user/donation/cash", 
    uploadReceipt.single("receipt"), 
    userController.submitCashDonation
);
// TAMA (May /api na):
router.post('/api/user/donation/in-kind', userController.submitInKindDonation);
module.exports = router;