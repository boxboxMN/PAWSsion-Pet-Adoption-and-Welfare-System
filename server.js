const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('PAWPON Server Running');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});