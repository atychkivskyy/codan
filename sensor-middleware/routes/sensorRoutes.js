const {Router} = require('express');
const sensorController = require('../controllers/sensorController');

const SensorRoutes = Router();

SensorRoutes.get("/test", sensorController.test)
SensorRoutes.post("/temperature", sensorController.retrieveTemperature)
SensorRoutes.post("/humidity", sensorController.retrieveHumidity)


module.exports = SensorRoutes