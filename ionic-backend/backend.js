const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const {InfluxDB} = require('@influxdata/influxdb-client');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'database_name',
    port: 3306
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos MySQL:', err);
        throw err;
    }
    console.log('Conexión establecida con la base de datos MySQL');
});

const influxDBConfig = {
    url: 'http://localhost:8086',
    token: 'c6c49c0a9d718d3650299a6cb082ed5e',
    org: 'codan',
    bucket: 'metrics'
};

const influxDBClient = new InfluxDB(influxDBConfig);
const app = express();

app.use(express.json());
app.use(cors());

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta MySQL:', err);
            return res.status(500).json({error: 'Error interno del servidor'});
        }
        if (results.length === 0) {
            return res.status(401).json({error: 'Credenciales incorrectas'});
        }
        res.json({message: 'Inicio de sesión exitoso', user: results[0]});
    });
});

app.get('/influx-data', async (req, res) => {
    try {
        const fluxQuery = 'from(bucket: "metrics") \
                        |> range(start: -1m) \
                        |> filter(fn: (r) => r["_measurement"] == "sensor_data") \
                        |> filter(fn: (r) => (r["_field"] == "temperature" or r["_field"] == "humidity" or r["_field"] == "volatile" or r["_field"] == "co2")) \
                        |> group(columns: ["_sensor_id"])';

        const queryApi = influxDBClient.getQueryApi("codan");
        const result = await queryApi.collectRows(fluxQuery);

        res.json(result);
    } catch (error) {
        console.error('Error al obtener datos de InfluxDB:', error.message);
        res.status(500).json({error: 'Error al obtener datos de InfluxDB', details: error.message});
    }
});

const PORT = 826;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

