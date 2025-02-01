const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/save-token',notificationController.saveDeviceToken);
router.post('/send-notification',notificationController.sendNotification);
router.post('/assign-order',notificationController.assignOrder);
router.post('/update-status',notificationController.acceptOrder);

router.get('/get-status',notificationController.getAgentStatus);
module.exports = router;