const express = require("express");
const sensorRoutes = require("./sensorRoutes");
const morgan = require("morgan");
const IpFilter = require('express-ipfilter').IpFilter;


const PORT = process.env.SENSOR_MIDDLEWARE_PORT || 3000;
const app = express();

let blockedIps = [];

app.use(IpFilter(blockedIps, {mode: 'deny'}));

morgan.token('real-ip', function (req, res) {
    return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
});

app.use(morgan(':real-ip - :method :url :status :response-time ms - :res[content-length]'));
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
