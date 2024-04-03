const dotenv= require("dotenv").config();
const express = require("express")
const SensorRoutes = require("./routes/sensors")


const PORT = parseInt(process.env.PORT) || 3000
const app = express()



app.use((req, res, next) => {
  if (req.originalUrl != "/metrics") {
    console.log(`\n\n${new Date().toLocaleString()} | Method: ${req.method} | URL: ${req.originalUrl}`)
  }
  next()
})

app.use("/", SensorRoutes);
app.listen(PORT, () => {
  console.log(`Sensor middleware listening on port ${PORT}`)
})