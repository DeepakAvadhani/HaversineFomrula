const express = require('express');
const agentController = require('../controllers/agentController');

const router = express.Router();

router.post('/update-location', agentController.updateLocation);
router.get('/sorted-agents', agentController.getSortedAgents);

module.exports = router;
