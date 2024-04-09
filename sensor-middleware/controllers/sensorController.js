const mqttClient = require('../services/mqttService');

function test(req, res) {
    return res.status(200).send("Hello from Sensor Controller");
}

function retrieveData(req, res) {
    let timestamp = new Date();
    let temperature = {
        sensor_id: req.body.sensor_id, temperature: req.body.temperature, time: timestamp
    }
    let humidity = {
        sensor_id: req.body.sensor_id, humidity: req.body.humidity, time: timestamp
    }
    let co2 = {
        sensor_id: req.body.sensor_id, co2: req.body.co2, time: timestamp
    }
    let volatile = {
        sensor_id: req.body.sensor_id, volatile: req.body.volatile, time: timestamp
    }
    mqttClient.publish('sensor/temperature', JSON.stringify(temperature));
    mqttClient.publish('sensor/humidity', JSON.stringify(humidity));
    mqttClient.publish('sensor/co2', JSON.stringify(co2));
    mqttClient.publish('sensor/volatile', JSON.stringify(volatile));
    return res.status(200).send("Data received");
}

module.exports = {
    test, retrieveData
}
