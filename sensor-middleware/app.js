const express = require("express");
const sensorRoutes = require("./sensorRoutes");
const morgan = require("morgan");

const { initializeRedisClient } = require('./tokenBucketConnections');

const PORT = process.env.SENSOR_MIDDLEWARE_PORT || 3000;


async function initializeExpressServer() {

    const app = express();

    morgan.token('real-ip', function (req, res) {
        return req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    });
    
    app.use(morgan(':real-ip - :method :url :status :response-time ms - :res[content-length]'));
    app.use(express.json());
    
    await initializeRedisClient();

    app.use("/", sensorRoutes);
  
    app.listen(PORT, () => {
        console.log(`sensor-middleware listening on port ${PORT}`);
    });
}

initializeExpressServer()
.then()
.catch((e) => console.error(e));
