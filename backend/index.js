const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Projects directory path
const projectsDir = path.join(__dirname, 'projects');

// Route to list directories in /projects
app.get('/projects', (req, res) => {
    fs.readdir(projectsDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read projects directory' });
        }

        const directories = files
            .filter(file => file.isDirectory())
            .map(dir => dir.name);

        res.json(directories);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
