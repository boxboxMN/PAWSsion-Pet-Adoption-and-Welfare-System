const multer = require("multer");
const path = require("path");

// Storage Config para sa Pets
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/pets");
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 999999);
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Storage Config para sa Org Profile Pics
const orgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/orgs/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'org-' + (req.session?.accountId || 'user') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Storage Config para sa QR Codes
const qrStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/qr/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'qr-' + (req.session?.accountId || 'user') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// ==========================================
// NEW: Storage Config para sa Dropoff Details
// ==========================================
const dropoffStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/dropoff/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'dropoff-' + (req.session?.accountId || 'user') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

const uploadOrgPic = multer({ storage: orgStorage, fileFilter: imageFilter });
const uploadQR = multer({ storage: qrStorage, fileFilter: imageFilter });

// NEW: Multer instance para sa Dropoff
const uploadDropoff = multer({ storage: dropoffStorage, fileFilter: imageFilter });
// ==========================================
// NEW: Storage Config for In-Kind Proof Images
//   (used by org to upload proof when approving/rejecting)
//   (also used by user when submitting in-kind donation)
// ==========================================
const inkindProofStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = "uploads/inkind-proof/";
        // Ensure the folder exists (safe even if called repeatedly)
        const fs = require("fs");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const who = req.session?.accountId || "guest";
        cb(null, "inkind-" + who + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});
module.exports = {
    uploadPet: upload,
    uploadOrgPic: uploadOrgPic,
    uploadQR: uploadQR,
    uploadDropoff: uploadDropoff ,
     uploadInkindProof: multer({ storage: inkindProofStorage, fileFilter: imageFilter }) 
};