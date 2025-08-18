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

    // Yeni bir fonksiyon ekliyoruz: getTree
    function getTree(dir, indent = "") {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        let tree = "";

        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            tree += indent + "├── " + item.name + "\n";

            if (item.isDirectory()) {
                tree += getTree(fullPath, indent + "│   ");
            }
        }

        return tree;
    }

    // Örnek bir endpoint ekliyoruz:
    app.get('/project/tree', (req, res) => {
        const dirPath = path.join(__dirname, '../projects');
        try {
            const tree = getTree(dirPath);
            res.status(200).send(tree);
        } catch (error) {
            console.error('Error generating tree:', error); // Hata logu ekledim
            res.status(500).json({ error: 'Failed to generate project tree' });
        }
    });

    // Yeni bir endpoint ekliyoruz: /project/file
    app.get('/project/file', (req, res) => {
        const { filePath } = req.query;

        if (!filePath) {
            return res.status(400).json({ error: 'filePath is required' });
        }

        const absolutePath = path.join(__dirname, '../projects', filePath); // currentProject'i ekliyoruz
        const resolvedPath = path.resolve(absolutePath); // Tam çözümleme yapıyoruz

        console.log('Resolved absolutePath:', resolvedPath); // Çözümlenen tam yolu logluyoruz

        if (!fs.existsSync(resolvedPath)) {
            console.error('File not found at:', resolvedPath); // Hata logu ekledim
            return res.status(404).json({ error: 'File not found' });
        }

        fs.readFile(resolvedPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err); // Hata logu ekledim
                return res.status(500).json({ error: 'Failed to read file' });
            }

            res.status(200).json({ content: data });
        });
    });

    app.post('/project/file', (req, res) => {
        const { filePath, content } = req.body;

        if (!filePath || content === undefined) {
            return res.status(400).json({ error: 'filePath and content are required' });
        }

        const absolutePath = path.join(__dirname, '../projects', filePath); // currentProject'i ekliyoruz
        const resolvedPath = path.resolve(absolutePath); // Tam çözümleme yapıyoruz

        fs.writeFile(resolvedPath, content, 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save file' });
            }

            res.status(200).json({ message: 'File saved successfully' });
        });
    });
};
