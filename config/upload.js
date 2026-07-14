const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,"uploads/pets");
    },


    filename:(req,file,cb)=>{

        const unique =
        Date.now()+"-"+Math.round(Math.random()*999999);

        cb(
            null,
            unique + path.extname(file.originalname)
        );

    }

});


const upload = multer({
    storage:storage
});


// ==========================================
// NEW: Multer Storage Config para sa Org Profile Pics
// ==========================================
const orgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/orgs/'); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'org-' + req.session.accountId + '-' + uniqueSuffix + path.extname(file.originalname));
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

// DITO SA EXPORTS: I-export pareho ang lumang upload at ang bagong uploadOrgPic
module.exports = {
    uploadPet: upload, // Kung 'upload' ang pangalan ng variable ng sa pets mo dati
    uploadOrgPic: uploadOrgPic
};