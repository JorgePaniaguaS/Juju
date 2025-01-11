const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const dbConfig = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database',
    };

sql.connect(dbConfig).then(pool => {
    if (pool.connected) {
        console.log('Connected to the database');
    }
}).catch(err => {
    console.error('Database connection failed: ', err);
});

const bookRoutes = require('./routes/bookRoutes');
app.use('/api', bookRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('No token provided');

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token');
        req.userId = decoded.id;
        next();
    });
};

app.use('/api/books', verifyToken);

const swaggerSetup = require('./swagger');
swaggerSetup(app);
