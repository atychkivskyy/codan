const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Importa el módulo cors
const { InfluxDB } = require('@influxdata/influxdb-client'); // Importa el cliente de InfluxDB

// Configuración de la conexión a la base de datos MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root', // Tu nombre de usuario de MySQL
  password: 'Servihabitat.3', // Tu contraseña de MySQL
  database: 'database_name', // El nombre de tu base de datos MySQL
  port: 3306 // Puerto MySQL
};

// Crear una conexión a la base de datos MySQL
const connection = mysql.createConnection(dbConfig);

// Conectar a la base de datos MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos MySQL:', err);
    throw err;
  }
  console.log('Conexión establecida con la base de datos MySQL');
});

// Configuración de la conexión a la base de datos InfluxDB
const influxDBConfig = {
  url: 'http://localhost:8086',
  token: 'c6c49c0a9d718d3650299a6cb082ed5e', // Cambia por tu token de InfluxDB
  org: 'codan', // Cambia por tu organización de InfluxDB
  bucket: 'metrics' // Cambia por tu bucket de InfluxDB
};

// Crear una instancia del cliente de InfluxDB
const influxDBClient = new InfluxDB(influxDBConfig);

// Crear una aplicación Express
const app = express();

// Middleware para manejar solicitudes JSON
app.use(express.json());

// Middleware para habilitar CORS
app.use(cors());

// Ruta para manejar la solicitud POST
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Realizar una consulta a la base de datos MySQL para autenticar al usuario
  const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta MySQL:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    // Usuario autenticado, puedes enviar una respuesta exitosa aquí
    res.json({ message: 'Inicio de sesión exitoso', user: results[0] });
  });
});

// Ruta para manejar la solicitud GET para obtener datos de InfluxDB
app.get('/influx-data', async (req, res) => {
  try {
    const fluxQuery = 'from(bucket: "metrics") \
                        |> range(start: -1m) \
                        |> filter(fn: (r) => r["_measurement"] == "sensor_data") \
                        |> filter(fn: (r) => (r["_field"] == "temperature" or r["_field"] == "humidity" or r["_field"] == "volatile" or r["_field"] == "co2")) \
                        |> group(columns: ["_sensor_id"])'; // Agrupar por ID del sensor

    const queryApi = influxDBClient.getQueryApi("codan");
    const result = await queryApi.collectRows(fluxQuery);

    // Enviar los datos recibidos desde InfluxDB al frontend
    res.json(result);
  } catch (error) {
    console.error('Error al obtener datos de InfluxDB:', error.message);
    res.status(500).json({ error: 'Error al obtener datos de InfluxDB', details: error.message });
  }
});

// Iniciar el servidor
const PORT = 826; // Puerto en el que se ejecutará el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

