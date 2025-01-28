const express = require('express');
const agentController = require('../controllers/agentController');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/getProduct/:barcode',productController.getProductByBarcode)
module.exports = router;
