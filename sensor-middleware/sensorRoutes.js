const {Router} = require('express');
const sensorController = require('./sensorController');

const SensorRoutes = Router();

SensorRoutes.get("/test", sensorController.test);
SensorRoutes.post("/data", sensorController.retrieveData);

module.exports = SensorRoutes
