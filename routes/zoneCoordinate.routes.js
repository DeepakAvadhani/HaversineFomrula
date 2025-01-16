const express = require('express');
const router = express.Router();
const zoneController = require('../controllers/zone.controller');

// POST route to get zone info
router.post('/zone-info', zoneController.getZoneInfo);

module.exports = router;
