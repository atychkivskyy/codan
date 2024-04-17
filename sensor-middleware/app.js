const express = require("express");
const sensorRoutes = require("./sensorRoutes");
const morgan = require("morgan");

const PORT = process.env.SENSOR_MIDDLEWARE_PORT || 3000;
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use("/", sensorRoutes);

const server = app.listen(PORT, () => {
    console.log(`sensor-middleware listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully.');
    server.close(() => {
        console.log('Server closed.');
    });
});
