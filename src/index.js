const express = require('express');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// **************************************************************
// In-memory users array
let users = [];

// Create a User
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email must be required.' });
    }

    const new_user = {
        id: uuidv4(),
        name,
        email
    };

    users.push(new_user);
    res.status(201).json(new_user);
});

// Retrieve a User
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ error: 'User you entered not found.' });
    }

    res.status(200).json(user);
});

// Update a User
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email must be required.' });
    }

    const user_index = users.findIndex(u => u.id === id);
    if (user_index === -1) {
        return res.status(404).json({ error: 'User you entered not found.' });
    }

    users[user_index] = { id, name, email };
    res.status(200).json(users[user_index]);
});

// Delete a User
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const user_index = users.findIndex(u => u.id === id);

    if (user_index === -1) {
        return res.status(404).json({ error: 'User you entered not found.' });
    }

    users.splice(user_index, 1);
    res.status(204).send(); // No content
});

// Root route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// **************************************************************
// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing
