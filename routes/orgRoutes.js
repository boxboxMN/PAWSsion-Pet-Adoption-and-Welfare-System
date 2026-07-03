//Routes para sa Organization modules (manage pets, adoption requests, donations, atbp.).

const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Organization route is working");
});

module.exports = router;