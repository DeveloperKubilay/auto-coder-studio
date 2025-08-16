const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    const projectsDir = path.join(__dirname, '../projects');

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
};
