const mongoose = require('mongoose');
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect(uri).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const temperatureSchema = new mongoose.Schema({
    sensor_id: Number,
    temperature: Number,
    time: Date,
}, { versionKey: false });

const humiditySchema = new mongoose.Schema({
    sensor_id: Number,
    humidity: Number,
    time: Date,
}, { versionKey: false });
const co2Schema = new mongoose.Schema({
    sensor_id: Number,
    co2: Number,
    time: Date,
}, { versionKey: false });
const volatileSchema = new mongoose.Schema({
    sensor_id: Number,
    volatile: Number,
    time: Date,
}, { versionKey: false });

const Temperature = mongoose.model('Temperature', temperatureSchema);
const Humidity = mongoose.model('Humidity', humiditySchema);
const CO2 = mongoose.model('CO2', co2Schema);
const Volatile = mongoose.model('Volatile', volatileSchema);

module.exports = {Temperature, Humidity, CO2, Volatile};
