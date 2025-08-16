const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const templateModule = require('../modules/template');

module.exports = (app) => {
    const projectsDir = path.join(__dirname, '../projects');

    app.post('/createProject', (req, res) => {
        const { ProjectName, template } = req.body;

        if (!ProjectName || !template) {
            return res.status(400).json({ error: 'ProjectName and template are required' });
        }

        const projectPath = path.join(projectsDir, ProjectName);

        if (fs.existsSync(projectPath)) {
            return res.status(400).json({ error: 'Project already exists' });
        }

        const selectedTemplate = templateModule[template];

        if (!selectedTemplate) {
            return res.status(400).json({ error: 'Invalid template' });
        }

        fs.mkdir(projectPath, { recursive: true }, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create project directory' });
            }

            // Create settings.json
            const settingsPath = path.join(projectPath, 'settings.json');
            fs.writeFileSync(settingsPath, JSON.stringify(selectedTemplate, null, 2));

            // Create files from template
            selectedTemplate.Files.forEach(file => {
                const filePath = path.join(projectPath, file.filename);
                fs.writeFileSync(filePath, file.content);
            });

            // Run install command
            exec(selectedTemplate.Install, { cwd: projectPath }, (installErr) => {
                if (installErr) {
                    return res.status(500).json({ error: 'Failed to install dependencies' });
                }

                res.status(201).json({ projectName: ProjectName });
            });
        });
    });
};
