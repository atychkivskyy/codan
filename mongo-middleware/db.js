const mongoose = require('mongoose');
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect(uri).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const TemperatureSchema = new mongoose.Schema({
    sensor_id: Number,
    temperature: Number,
    time: Date,
});
const HumiditySchema = new mongoose.Schema({
    sensor_id: Number,
    humidity: Number,
    time: Date,
});
const CO2Schema = new mongoose.Schema({
    sensor_id: Number,
    co2: Number,
    time: Date,
});
const VolatileSchema = new mongoose.Schema({
    sensor_id: Number,
    volatile: Number,
    time: Date,
});

const Temperature = mongoose.model('Temperature', TemperatureSchema);
const Humidity = mongoose.model('Humidity', HumiditySchema);
const CO2 = mongoose.model('CO2', CO2Schema);
const Volatile = mongoose.model('Volatile', VolatileSchema);

module.exports = {Temperature, Humidity, CO2, Volatile};
