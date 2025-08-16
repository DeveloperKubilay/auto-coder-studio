const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    const projectsDir = path.join(__dirname, '../projects');

    app.post('/project', (req, res) => {
        const { ProjectName } = req.body;

        if (!ProjectName) {
            return res.status(400).json({ error: 'ProjectName is required' });
        }

        const projectPath = path.join(projectsDir, ProjectName);
        const settingsPath = path.join(projectPath, 'settings.json');

        if (!fs.existsSync(settingsPath)) {
            return res.status(404).json({ error: 'settings.json not found' });
        }

        fs.readFile(settingsPath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to read settings.json' });
            }

            res.status(200).json(JSON.parse(data));
        });
    });
};
