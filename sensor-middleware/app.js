const express = require("express");
const sensorRoutes = require("./sensorRoutes");
const morgan = require("morgan");
const ipfilter = require('express-ipfilter').IpFilter

const blockedIPs = ['192.168.1.100', '10.0.3.21'];
const PORT = process.env.SENSOR_MIDDLEWARE_PORT || 3000;
const app = express();

app.use(ipfilter(blockedIPs));
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
