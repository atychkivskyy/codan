const {Router} = require('express');
const sensorController = require('../controllers/sensorController');

const SensorRoutes = Router();

SensorRoutes.get("/test", sensorController.test);
SensorRoutes.post("/temperature", sensorController.retrieveTemperature);
SensorRoutes.post("/humidity", sensorController.retrieveHumidity);
SensorRoutes.post("/co2", sensorController.retrieveCO2);
SensorRoutes.post("/volatiles", sensorController.retrieveVolatiles);


module.exports = SensorRoutes
