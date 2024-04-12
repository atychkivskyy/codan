const express = require("express");
const sensorRoutes = require("./sensorRoutes");
const morgan = require("morgan");
const ipfilter = require('express-ipfilter').IpFilter;

const PORT = process.env.SENSOR_MIDDLEWARE_PORT || 3000;
const app = express();

const blockedIPs = ['192.168.1.133'];
const ipFilter = ipfilter(blockedIPs, {mode: 'deny'});

app.use(ipFilter);

app.use((err, req, res, next) => {
    if (err instanceof ipfilter.IpDeniedError) {
        res.status(403).send('Access denied');
    } else {
        next(err);
    }
});

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
