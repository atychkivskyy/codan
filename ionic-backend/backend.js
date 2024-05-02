const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const {InfluxDB} = require('@influxdata/influxdb-client');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Servihabitat.3',
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

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT id, username, isEnabled, isAdmin FROM usuarios WHERE username = ? AND password = ?`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta MySQL:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            console.log(results.length);
            return res.status(404).json({ error: 'Usuario o contraseña incorrectos' });
        }
        res.json({ message: 'Credenciales correctas' });
    });
});

app.get('/getUsers', async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT username, isEnabled, isAdmin FROM usuarios `;
    connection.query(query,(err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta MySQL:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length === 0) {
            console.log(results.length);
            return res.status(404).json({ error: 'Usuario o contraseña incorrectos' });
        }
        res.json(results);
    });
});

app.post('/isEnabled', async (req, res) => {
    const { username } = req.body;
    const query = `SELECT * FROM usuarios WHERE username = ? AND isEnabled = true`;
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta MySQL:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no habilitado' });
        }
        res.json({ message: 'Usuario habilitado', user: results[0] });
    });
});

app.post('/deleteUser', async (req, res) => {
    const { username } = req.body;
    const query = `DELETE FROM usuarios WHERE username = ?`;
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al ejecutar DELETE:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    });
});


app.post('/createUser', async (req, res) => {
    const { username, password } = req.body;
    const query = `INSERT INTO usuarios (username, password, isEnabled, isAdmin) VALUES (?, ?, false, false)`;
    connection.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Error al insertar el nuevo usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        return res.status(200).json({ message: 'Usuario creado exitosamente' });
    });
});

app.post('/user', (req, res) => {
    const { username } = req.body;
    let query = `SELECT username FROM usuarios WHERE username = ?`;
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al ejecutar la consulta MySQL:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        if (results.length > 0) {
            return res.status(200).json({ message: 'Usuario existente' });
        }
        return res.status(404).json({ error: 'Usuario no existente' });
    });
});



app.post('/enableUser', async (req, res) => {
    const { username } = req.body;
    console.log(username);

    const query = `UPDATE usuarios SET isEnabled = 1 WHERE username = ?`;

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al habilitar al usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        return res.status(200).json({ message: 'Usuario habilitado exitosamente' });
    });
});

app.post('/disableUser', async (req, res) => {
    const { username } = req.body;
    const query = `UPDATE usuarios SET isEnabled = false WHERE username = ?`;
    console.log(username);

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al deshabilitar al usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        return res.status(200).json({ message: 'Usuario deshabilitado exitosamente' });
    });
});

app.post('/grantRoleUser', async (req, res) => {
    const { username } = req.body;
    console.log(username);

    const query = `UPDATE usuarios SET isAdmin = 1 WHERE username = ?`;

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al dar privilegios al usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        return res.status(200).json({ message: 'Usuario habilitado exitosamente' });
    });
});

app.post('/removeRoleUser', async (req, res) => {
    const { username } = req.body;
    console.log(username);

    const query = `UPDATE usuarios SET isAdmin = 0 WHERE username = ?`;

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al quitar privilegios al usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        return res.status(200).json({ message: 'Usuario habilitado exitosamente' });
    });
});


const PORT = 826;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

