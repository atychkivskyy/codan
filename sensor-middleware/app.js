const express = require("express");
const sensorRoutes = require("./routes/sensorRoutes");


const PORT = 3000;
const app = express();


app.use((req, res, next) => {
    if (req.originalUrl !== "/metrics") {
        console.log(`\n\n${new Date().toLocaleString()} | Method: ${req.method} | URL: ${req.originalUrl}`);
    }
    next()
})

app.use(express.json());
app.use("/", sensorRoutes);

const server = app.listen(PORT, () => {
    console.log(`sensor-middleware listening on port ${PORT}`);
})

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('sensor-middleware closed');
    });
});
