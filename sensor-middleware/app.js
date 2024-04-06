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

app.listen(PORT, () => {
    console.log(`Sensor middleware listening on port ${PORT}`);
})