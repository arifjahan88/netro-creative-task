const express = require("express");
const { demoRedisExmp } = require("../controllers/demoredisExmpController");

const router = express.Router();

//User Login Route
router.get("/demo-redis", demoRedisExmp);

module.exports = router;
