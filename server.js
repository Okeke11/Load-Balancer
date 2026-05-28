const express = require('express');
const app = express();
const port = process.argv[2] || 4001; 

app.get('/', (req, res) => {
    // Force the browser to render standard text/html
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<h2>Response from server running on port ${port}</h2>`);
});

app.listen(port, () => console.log(`Backend server active on port ${port}`));