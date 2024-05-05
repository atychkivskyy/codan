const redis = require('redis');
const mqtt = require('mqtt');

const MQTT_BROKER_URL = 'mqtt://mosquitto:1884';

const MQTTclient = mqtt.connect(MQTT_BROKER_URL);

// Create a Redis client
const redisClient = redis.createClient({
    url: 'redis://redis:6379' // Cambiar con variables de entorno
});

// MQTT client events

MQTTclient.on('connect', () => {
    console.log('Connected to Mosquitto broker');
});

MQTTclient.on('reconnect', () => {
    console.log('Reconnecting to Mosquitto broker...');
});

MQTTclient.on('error', (error) => {
    console.error('MQTT connection error:', error);
    MQTTclient.reconnect();
});

MQTTclient.on('offline', () => {
    console.log('MQTT client is offline');
});

MQTTclient.on('close', () => {
    console.log('Connection to Mosquitto broker closed');
});

// Redis client events

redisClient.on('connect', () => {
    console.log('Connected to Redis - Token Bucket');
});

redisClient.on('error', (error) => {
    console.error('Error connecting to Redis:', error);
});

module.exports = {
    redisClient,
    client
};