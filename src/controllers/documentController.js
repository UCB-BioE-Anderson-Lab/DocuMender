const fs = require('fs');
const path = require('path');
const Document = require('../models/document');

const document = new Document();

// Define the directory where the documents will be saved
const documentsDir = path.join(__dirname, '..', 'documents');

// Ensure the directory exists
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir);
}

exports.createSection = (req, res) => {
  const { path, name, content } = req.body;
  const newSection = document.addSection(path, name, content);

  if (!newSection) {
    return res.status(404).json({ error: 'Parent section not found' });
  }

  res.status(201).json({ message: 'Section created', section: newSection });
};

exports.updateSection = (req, res) => {
  const { path } = req.params;
  const { content } = req.body;
  console.log(`[updateSection] Updating section with path: ${path}, content: ${content}`);
  const updatedSection = document.updateSection(path, content);

  if (!updatedSection) {
    console.log(`[updateSection] Section not found: ${path}`);
    return res.status(404).json({ error: 'Section not found' });
  }

  console.log(`[updateSection] Section updated: ${path}`);
  res.status(200).json({ message: 'Section updated', section: updatedSection });
};

exports.deleteSection = (req, res) => {
  const { path } = req.params;
  const deleted = document.deleteSection(path);

  if (!deleted) {
    return res.status(404).json({ error: 'Section not found' });
  }

  res.status(200).json({ message: 'Section deleted' });
};

exports.getSection = (req, res) => {
  const { path } = req.params;
  const section = document.findSection(path);

  if (!section) {
    return res.status(404).json({ error: 'Section not found' });
  }

  res.status(200).json({ section });
};

exports.moveSection = (req, res) => {
  const { sourcePath, destinationPath } = req.body;
  const result = document.moveSection(sourcePath, destinationPath);

  if (result.error) {
    return res.status(404).json({ error: result.error });
  }

  res.status(200).json({ message: result.message });
};


exports.saveDocument = (req, res) => {
  // Generate a unique filename based on the current timestamp
  const filename = `document_${Date.now()}.txt`;
  const filePath = path.join(documentsDir, filename);

  // Get the document content as plain text
  const documentContent = document.saveAsText(document.root);

  // Write the document content to the file
  fs.writeFileSync(filePath, documentContent);

  // Generate the URL for the saved file
  const fileUrl = `http://localhost:3000/documents/${filename}`;

  // Return the URL to the client
  res.status(200).json({ message: 'Document saved', url: fileUrl });
};