const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();


app.use(cors());
app.use(express.json());

let clients = [];

app.post('/register', (req, res) => {
    const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;


    const clientID = uuidv4();
    const clientSecret = uuidv4();

    const hashedClientSecret = bcrypt.hashSync(clientSecret, 10);


    const client = { clientID, clientSecret: hashedClientSecret, companyName, ownerName, rollNo, ownerEmail, accessCode };
    clients.push(client);

    res.json({ clientID, clientSecret });
});

app.post('/auth', (req, res) => {
    const { clientID, clientSecret } = req.body;

    const client = clients.find(c => c.clientID === clientID);

    if (!client) {
        return res.status(400).json({ error: 'Invalid clientID or clientSecret' });
    }


    const isMatch = bcrypt.compareSync(clientSecret, client.clientSecret);

    if (!isMatch) {
        return res.status(400).json({ error: 'Invalid clientID or clientSecret' });
    }


    const token = jwt.sign({ clientID }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
