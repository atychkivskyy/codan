function test(req, res) {
    // Testeo de la API
    return res.send("Hello from Sensor Controller").status(200) 
}

function retrieveTemperature(req, res) {
    // Recibe un json con los datos del sensor y los guarda en un topic de mosquitto

    return res.status(200)
}

function retrieveHumidity(req, res) {
    // Recibe un json con los datos del sensor y los guarda en un topic de mosquitto

    return res.status(200)
}

module.exports = {
    test,
    retrieveTemperature,
    retrieveHumidity
}