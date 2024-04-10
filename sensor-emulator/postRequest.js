const axios = require('axios');
const SENSOR_COUNT = 10; // Number of sensors to emulate
const INTERVAL = 3000; // Interval for data sending in milliseconds

const url = 'http://localhost:80/data'; // Replace with your target URL

function generateRandomData(sensorId) {
    return {
        sensor_id: sensorId,
        temperature: Math.random() * 30 + 10, // Random temperature
        humidity: Math.random() * 100, // Random humidity
        co2: Math.random() * 100, // Random CO2 level
        volatile: Math.random() * 5 // Random volatile compound level
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
