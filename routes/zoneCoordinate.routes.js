const express = require("express");
const router = express.Router();
const zoneController = require("../controllers/zone.controller");
const zoneinfo = require("../controllers/getZoneInfo");

router.post("/zone-info", zoneController.assignShopToZone);
router.post("/getzoneinfo", zoneinfo.getNearestDeliveryAgents);
router.get("/findzone",zoneController.getZoneByCoordinates);
module.exports = router;
