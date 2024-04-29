const express = require("express");
const { produceQueue } = require("../controllers/message-queue/producer");

const router = express.Router();

//User Login Route
router.get("/demo-queue", produceQueue);

module.exports = router;
