const fs = require("fs");
const path = require("path");
const mqttClient = require('./mqttService');

exports.test = (req, res) => {
    return res.status(200).send("Hello from Sensor Controller");
};

exports.retrieveData = async (req, res, next) => {
    let data = {};
    if (req.method === 'POST') {
        data = req.body;
    } else if (req.method === 'GET') {
        data = req.query;
    }

    let timestamp = new Date();
    let temperature = {
        sensor_id: data.sensor_id, temperature: data.temperature, time: timestamp
    };
    let humidity = {
        sensor_id: data.sensor_id, humidity: data.humidity, time: timestamp
    };
    let co2 = {
        sensor_id: data.sensor_id, co2: data.co2, time: timestamp
    };
    let volatile = {
        sensor_id: data.sensor_id, volatile: data.volatile, time: timestamp
    };

    mqttClient.publish('sensor/temperature', JSON.stringify(temperature), (error) => {
        if (error) {
            console.error('Failed to publish message:', error);
        }
    });
    mqttClient.publish('sensor/humidity', JSON.stringify(humidity), (error) => {
        if (error) {
            console.error('Failed to publish message:', error);
        }
    });
    mqttClient.publish('sensor/co2', JSON.stringify(co2), (error) => {
        if (error) {
            console.error('Failed to publish message:', error);
        }
    });
    mqttClient.publish('sensor/volatile', JSON.stringify(volatile), (error) => {
        if (error) {
            console.error('Failed to publish message:', error);
        }
    });

    return next();
}

exports.home = (req, res) => {
    if (req.query.wadl === '') {
        const wadlPath = path.join(__dirname, 'service.wadl');
        res.type('application/xml');
        fs.createReadStream(wadlPath).pipe(res);
        return res.status(200);
    } else {
        return res.send("Welcome to the Sensor Middleware API.");
    }
}