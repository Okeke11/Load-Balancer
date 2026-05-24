const express = require('express');
const app = express();
const port = process.argv[2] || 3001; // Get port from command line

app.get('/', (req, res) => {
    res.send(`Response from server running on port ${port}`);
});

app.listen(port, () => console.log(`Backend server active on port ${port}`));