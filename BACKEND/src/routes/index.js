const express = require("express");
const router = express.Router();
const { getStatus } = require("../controllers/testController");

router.get("/", getStatus);

module.exports = router;
