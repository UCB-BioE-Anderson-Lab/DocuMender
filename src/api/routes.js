const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

router.post('/section', documentController.createSection);
router.put('/section/:path', documentController.updateSection);
router.delete('/section/:path', documentController.deleteSection);
router.get('/section/:path', documentController.getSection);
router.patch('/section/move', documentController.moveSection);
router.post('/save', documentController.saveDocument);

module.exports = router;

