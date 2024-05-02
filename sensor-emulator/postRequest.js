const axios = require('axios');
const SENSOR_COUNT = 300;
const INTERVAL = 5000;

const url = 'http://localhost:80/data';

let currentTemperature = 20;
let currentHumidity = 50;
let currentCO2 = 50;
let currentVolatile = 2.5;


function generateRandomData(sensorId) {
    currentTemperature += (Math.random() - 0.5) * 4;
    currentHumidity += (Math.random() - 0.5) * 10;
    currentCO2 += (Math.random() - 0.5) * 10;
    currentVolatile += (Math.random() - 0.5);

    currentTemperature = Math.min(Math.max(currentTemperature, 10), 50);
    currentHumidity = Math.min(Math.max(currentHumidity, 0), 100);
    currentCO2 = Math.min(Math.max(currentCO2, 0), 100);
    currentVolatile = Math.min(Math.max(currentVolatile, 0), 10);

    return {
        "sensor_id": sensorId,
        "temperature": currentTemperature,
        "humidity": currentHumidity,
        "co2": currentCO2,
        "volatile": currentVolatile
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

for (let i = 1; i <= SENSOR_COUNT; i++) {
    startSensorEmulator(i);
}
