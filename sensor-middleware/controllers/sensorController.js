const mqttClient = require('../services/mqttService');

function test(req, res) {
    return res.status(200).send("Hello from Sensor Controller");
}

function retrieveTemperature(req, res) {
    mqttClient.publish('sensor/temperature', JSON.stringify(req.body));
    return res.status(200).send("Temperature data received");
}

function retrieveHumidity(req, res) {
    mqttClient.publish('sensor/humidity', JSON.stringify(req.body));
    return res.status(200).send("Humidity data received");
}

function retrieveCO2(req, res) {
    mqttClient.publish('sensor/co2', JSON.stringify(req.body));
    return res.status(200).send("CO2 data received");
}

function retrieveOrganic(req, res) {
    mqttClient.publish('sensor/organic', JSON.stringify(req.body));
    return res.status(200).send("Organic data received");
}

module.exports = {
    test, retrieveTemperature, retrieveHumidity, retrieveCO2, retrieveOrganic
}