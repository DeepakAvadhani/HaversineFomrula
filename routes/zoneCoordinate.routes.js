const express = require("express");
const router = express.Router();
const zoneController = require("../controllers/zone.controller");
const zoneinfo = require("../controllers/getZoneInfo");

router.post("/zone-info", zoneController.getZoneInfo);
router.post("/getzoneinfo", zoneinfo.getNearestDeliveryAgents);
module.exports = router;
