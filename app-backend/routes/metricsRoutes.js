const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const {authenticate} = require("../middlewares/auth");

router.get('/metrics', authenticate, metricsController.queryMetrics);

module.exports = router;
