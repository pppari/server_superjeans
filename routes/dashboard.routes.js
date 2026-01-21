const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.controller");

router.get("/overview", dashboardController.getDashboardOverview);

module.exports = router;
