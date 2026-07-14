const express = require("express");
const path = require("path");
const pool = require("../config/database");

const upload = require("../config/upload");

const { addPet, getPets, getPetDetails } = require("../controllers/orgController");

const router = express.Router();

router.use(checkOrganizationApproval);


router.get("/dashboard", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../public/organization/dashboard.html")
    );

});


router.post(
    "/pets/add",
    upload.single("image"),
    addPet
);
router.get("/pending", (req, res) => {

    if (!req.session.accountId) {
        return res.redirect("/auth/login.html");
    }

    res.sendFile(
        path.join(__dirname, "../public/organization/orgPending.html")
    );
});

async function checkOrganizationApproval(req, res, next) {

    if (!req.session.accountId) {
        return res.redirect("/auth/login.html");
    }

    const [rows] = await pool.query(
        `SELECT status
         FROM accounts
         WHERE account_id=?`,
        [req.session.accountId]
    );

    if (!rows.length) {
        return res.redirect("/auth/login.html");
    }

    if (rows[0].status === "pending") {

        // If they're trying to access anything except /org/pending
        if (req.path !== "/pending") {
            return res.redirect("/org/pending");
        }

    }

    next();

}

router.get("/pets", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/pets.html"));
});

router.get("/pets/list", getPets);
router.get("/pets/:id", getPetDetails);

router.get("/adoption", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/adoption.html"));
});
router.get("/donation", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/donation.html"));
});
router.get("/kamustahan", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/kamustahan.html"));
});
router.get("/analytics", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/analytics.html"));
});
router.get("/settings", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/settings.html"));
});
router.get("/support", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/organization/support.html"));
});

module.exports = router;
