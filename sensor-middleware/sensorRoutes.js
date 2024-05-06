const {Router} = require('express');
const sensorController = require('./sensorController');
const tokenBucket = require('./tokenBucket');

const SensorRoutes = Router();

SensorRoutes.get("/test",sensorController.test);
SensorRoutes.post("/data",tokenBucket.checkTokens , sensorController.retrieveData, tokenBucket.addToken);
SensorRoutes.get("/", sensorController.home);

module.exports = SensorRoutes
