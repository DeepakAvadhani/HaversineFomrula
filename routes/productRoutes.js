const express = require('express');
const productController = require('../controllers/productController');
const router = express.Router();

router.get('/getProduct/:barcode',productController.getProductByBarcode)
module.exports = router;
