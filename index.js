const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const documentController = require('./src/controllers/documentController');
const path = require('path');

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Middleware to enable CORS
app.use(cors());

// Serve static files from the documents directory
const documentsDir = path.join(__dirname, 'src', 'documents');
app.use('/documents', express.static(documentsDir));

// Define the API endpoints for the plugin
app.post('/section', documentController.createSection);
app.put('/section/:path', documentController.updateSection);
app.delete('/section/:path', documentController.deleteSection);
app.get('/section/:path', documentController.getSection);
app.patch('/section/move', documentController.moveSection);
app.post('/save', documentController.saveDocument);

// Add a route to serve the openapi.yaml file
app.get('/openapi.yaml', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.yaml'));
});

// Add a route to serve the manifest file (.well-known/ai-plugin.json)
app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.sendFile(path.join(__dirname, '.well-known', 'ai-plugin.json'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

