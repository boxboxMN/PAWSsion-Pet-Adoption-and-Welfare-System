const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();
const userController = require("../controllers/userController");
const matchmakerController = require("../controllers/matchmakerController");
const { matchPets } = require("../controllers/matchmakerController");
const pool = require('../config/database');


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

const docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
      const dir = "uploads/documents/";
      if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
  },
  filename: function (req, file, cb) {
      const accountId = req.session?.accountId || "guest";
      cb(null, `doc-${accountId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const uploadDoc = multer({
  storage: docStorage,
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
// Idagdag itong storage configuration sa userRouter.js
const kamustahanStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = "uploads/kamustahan/";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        cb(null, `kamustahan-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const uploadKamustahan = multer({ storage: kamustahanStorage });

router.get("/api/pets", userController.getAvailablePets);
router.get("/api/pets/:id", userController.getPetById);
router.post( "/api/matchmaking", matchmakerController.matchPets);
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

router.get("/api/user/applications", userController.getUserApplications);
router.get("/api/user/donations", userController.getUserDonations);
router.get("/api/user/profile", userController.getProfile);
router.post("/api/user/profile/update", userController.updateProfile);
router.post("/api/user/profile/password", userController.updatePassword);
router.post("/api/user/profile/avatar", upload.single("avatar"), userController.updateAvatar);
router.get("/api/organizations", userController.getOrganizations);
router.post( "/api/user/donation/cash", uploadReceipt.single("receipt"), userController.submitCashDonation);
router.post('/api/user/donation/in-kind', userController.submitInKindDonation);
router.get("/api/user/approved-pets", userController.getApprovedAdoptedPets);
router.get("/api/user/kamustahan-history", userController.getKamustahanHistory);
router.post("/api/user/kamustahan", uploadKamustahan.single("photos"), userController.submitKamustahanUpdate);
router.post(
  '/api/adoptions/submit-application', 
  (req, res, next) => {
    uploadDoc.single('document')(req, res, (err) => {
      if (err) {
        // Huliin at ibalik ang eksaktong Multer validation error
        return res.status(400).json({
          status: 'error',
          message: err.message || 'Invalid file format uploaded.'
        });
      }
      next();
    });
  }, 
  userController.submitAdoptionApplication
);
// Check if the user has already applied for a specific pet
router.get('/check-applied/:petId', userController.checkAppliedStatus);

// When the user cancel the adoption application
router.patch('/api/user/applications/:id/cancel', userController.cancelAdoptionApplication);

// Get the recent activities of the user
router.get("/api/user/recent-activities", userController.getUserRecentActivities);

// Get the upcoming interview schedules of the user
router.get("/api/user/upcoming-schedules", userController.getUserUpcomingSchedules);
// Kunin ang detalye ng isang partikular na organisasyon para sa modal profile
router.get("/api/organizations/:id", userController.getOrganizationById);
// Siguraduhin na gamit ang uploadKamustahan middleware
router.put('/api/user/kamustahan/:id', uploadKamustahan.single('photos'), async (req, res) => {
    try {
        const updateId = req.params.id;
        const { update_text } = req.body;
        
        // Gamitin ang pool na naka-export sa itaas
        if (req.file) {
            const photoPath = `/uploads/kamustahan/${req.file.filename}`;
            await pool.query(
                'UPDATE kamustahan_updates SET update_text = ?, photos = ? WHERE update_id = ?', 
                [update_text, photoPath, updateId]
            );
        } else {
            await pool.query(
                'UPDATE kamustahan_updates SET update_text = ? WHERE update_id = ?', 
                [update_text, updateId]
            );
        }

        res.json({ success: true, message: 'Update successfully modified.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});
module.exports = router;
