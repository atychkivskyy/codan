const mqttClient = require('../services/mqttService');

function test(req, res) {
    return res.status(200).send("Hello from Sensor Controller");
}

function retrieveTemperature(req, res) {
    const temperatureData = req.body;
    mqttClient.publish('sensor/temperature', JSON.stringify(temperatureData));
    return res.status(200).send("Temperature data received");
}

function retrieveHumidity(req, res) {
    const humidityData = req.body;
    mqttClient.publish('sensor/humidity', JSON.stringify(humidityData));
    return res.status(200).send("Humidity data received");
}

module.exports = {
    test, retrieveTemperature, retrieveHumidity
}