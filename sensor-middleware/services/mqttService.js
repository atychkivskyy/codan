const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://mosquitto::1883');

client.on('connect', () => {
    console.log('Connected to Mosquitto broker');
});

client.on('error', (error) => {
    console.error('Connection to Mosquitto broker failed:', error);
});

module.exports = client;
