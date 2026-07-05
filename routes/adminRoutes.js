
const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin route is working");
});

module.exports = router;
