const express = require('express');
const agentController = require('../controllers/agentController');
const productController = require('../controllers/productController');
const router = express.Router();

router.post('/update-location', agentController.updateLocation);
router.get('/sorted-agents', agentController.getSortedAgents);
router.get('/getProduct/:barcode',productController.getProductByBarcode)
module.exports = router;
