const mqtt = require('mqtt');
const {Volatile, CO2, Humidity, Temperature} = require("./db");
const client = mqtt.connect('mqtt://mosquitto:1883');

client.on('connect', () => {
    console.log('Connected to Mosquitto broker');
    client.subscribe('sensor/#');
});

client.on('message', (topic, message) => {
    console.log(message.toString());
    const data = JSON.parse(message);
    console.log(data);
    switch (topic) {
        case 'sensor/temperature':
            new Temperature(data).save();
            break;
        case 'sensor/humidity':
            new Humidity(data).save();
            break;
        case 'sensor/co2':
            new CO2(data).save();
            break;
        case 'sensor/volatile':
            new Volatile(data).save();
            break;
        default:
            console.log(`No handler for topic ${topic}`);
    }
});

client.on('error', (error) => {
    console.error('MQTT client error:', error);
});

module.exports = client;
