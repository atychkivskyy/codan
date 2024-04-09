const mqttClient = require('../services/mqttService');
let timestamp = new Date().getTime();


function test(req, res) {
    return res.status(200).send("Hello from Sensor Controller");
}

function retrieveTemperature(req, res) {
    let temperature={
        id: req.body.id_nodo,
        temperature: req.body.temperatura,
        time:timestamp
    }
    mqttClient.publish('sensor/temperature', JSON.stringify(temperature));
    return res.status(200).send("Temperature data received");
}

function retrieveHumidity(req, res) {
    let humidity={
        id: req.body.id_nodo,
        humedad: req.body.humedad,
        time:timestamp
    }
    mqttClient.publish('sensor/humidity', JSON.stringify(humidity));
    return res.status(200).send("Humidity data received");
}

function retrieveCO2(req, res) {
    let co2={
        id: req.body.id_nodo,
        temperature: req.body.co2,
        time:timestamp
    }
    mqttClient.publish('sensor/co2', JSON.stringify(co2));
    return res.status(200).send("CO2 data received");
}

function retrieveVolatiles(req, res) {
    let volatil={
        id: req.body.id_nodo,
        volatil: req.body.volatiles,
        time:timestamp
    }
    mqttClient.publish('sensor/organic', JSON.stringify(volatil));
    return res.status(200).send("Organic data received");
}

module.exports = {
    test, retrieveTemperature, retrieveHumidity, retrieveCO2, retrieveVolatiles
}
