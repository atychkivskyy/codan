const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const sequelize = require('./config/mysql');

const port = process.env.PORT || 8824;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
    if (req.query.wadl === '') {
        const wadlPath = path.join(__dirname, 'service.wadl');
        res.type('application/xml');
        fs.createReadStream(wadlPath).pipe(res);
    } else {
        res.send('Welcome to the API. Use ?wadl to get the WADL documentation.');
    }
});

app.use('/api', userRoutes);
app.use('/api', metricsRoutes);

sequelize.sync()
    .then(() => {
        app.listen(port, () => console.log(`Server running on port ${port}`));
    }).catch(err => {
    console.error('Unable to connect to the database:', err.message || err);
});
