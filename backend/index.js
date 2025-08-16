const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// JSON body parser
app.use(express.json());

// Dynamically load all modules in the loaders folder
const loadersDir = path.join(__dirname, 'loaders');
fs.readdirSync(loadersDir).forEach(file => {
    const loaderPath = path.join(loadersDir, file);
    if (fs.statSync(loaderPath).isFile() && file.endsWith('.js')) {
        require(loaderPath)(app);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
