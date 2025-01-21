const express = require('express');
const { updateLocation, getSortedAgents } = require('../controllers/agentController');

const router = express.Router();

router.post('/update-location', updateLocation);
router.get('/sorted-agents', getSortedAgents);

module.exports = router;
