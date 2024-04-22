const mqtt = require('mqtt');

const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || 'mqtt://mosquitto:1883';

const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('Connected to Mosquitto broker');
});

client.on('reconnect', () => {
    console.log('Reconnecting to Mosquitto broker...');
});

client.on('error', (error) => {
    console.error('MQTT connection error:', error);
    client.reconnect();
});

client.on('offline', () => {
    console.log('MQTT client is offline');
});

client.on('close', () => {
    console.log('Connection to Mosquitto broker closed');
});


module.exports = client;
