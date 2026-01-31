const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getAttributes,
  createAttribute,
  updateAttribute,
  deleteAttribute
} = require('../controllers/settingsController');
const { authenticateToken } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', authenticateToken, authorize('admin'), getSettings);
router.put('/', authenticateToken, authorize('admin'), updateSettings);

router.get('/attributes', getAttributes);
router.post('/attributes', authenticateToken, authorize('admin'), createAttribute);
router.put('/attributes/:id', authenticateToken, authorize('admin'), updateAttribute);
router.delete('/attributes/:id', authenticateToken, authorize('admin'), deleteAttribute);

module.exports = router;