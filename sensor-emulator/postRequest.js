const axios = require('axios');
const SENSOR_COUNT = 5;
const INTERVAL = 5000;

const url = 'http://localhost:80/test';

function generateRandomData(sensorId) {
    return {
        sensor_id: sensorId,
        temperature: Math.random() * 30 + 10,
        humidity: Math.random() * 100,
        co2: Math.random() * 100,
        volatile: Math.random() * 5
    };
}

function startSensorEmulator(sensorId) {
    setInterval(() => {
        const data = generateRandomData(sensorId);
        axios.post(url, data)
            .then(() => console.log(`Sensor ${sensorId} data sent`))
            .catch(error => console.error(`Error from sensor ${sensorId}:`, error.message));
    }, INTERVAL);
}

for (let i = 0; i < SENSOR_COUNT; i++) {
    startSensorEmulator(i);
}
