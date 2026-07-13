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


module.exports = upload;