// const { sequelize } = require("../models");
// const { QueryTypes } = require("sequelize");

// exports.getZoneInfo = async (req, res) => {
//   const { latitude, longitude } = req.body;

//   if (!latitude || !longitude) {
//     return res
//       .status(400)
//       .json({ error: "Latitude and Longitude are required." });
//   }

//   try {
//     const query = `
//       SELECT 
//         z.zone_name,
//         ST_Distance(
//           ST_Transform(ST_SetSRID(ST_Point(z.longitude, z.latitude), 4326), 32643),
//           ST_Transform(ST_SetSRID(ST_Point(:longitude, :latitude), 4326), 32643)
//         ) AS distance
//       FROM zone_coordinates z
//       JOIN map m ON z.zone_id = m.gid
//       WHERE ST_Intersects(
//         m.geom, 
//         ST_Transform(ST_SetSRID(ST_Point(:longitude, :latitude), 4326), 32643)
//       )
//       ORDER BY distance ASC
//       LIMIT 1;
//     `;

//     const result = await sequelize.query(query, {
//       replacements: { latitude, longitude },
//       type: QueryTypes.SELECT,
//     });

//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No zone found for the given coordinates." });
//     }

//     res.json(result[0]);
//   } catch (error) {
//     console.error("Error fetching zone info:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const { ZoneCoordinates } = require("../models"); // shop_zone table

exports.assignShopToZone = async (req, res) => {
  const { shop_id, latitude, longitude } = req.body;

  if (!shop_id || !latitude || !longitude) {
    return res.status(400).json({ error: "shop_id, latitude, and longitude are required." });
  }

  try {
    // Ensure the point and geometry are in the same SRID (32643)
    const query = `
      SELECT gid
      FROM map
      WHERE ST_Contains(
        ST_Transform(geom, 32643),  -- Make sure the geometry is in SRID 32643
        ST_Transform(ST_SetSRID(ST_Point(:longitude, :latitude), 4326), 32643)  -- Transform point to SRID 32643
      )
      LIMIT 1;
    `;

    const result = await sequelize.query(query, {
      replacements: { latitude, longitude },
      type: QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res.status(404).json({ message: "No zone found for the given coordinates." });
    }

    const zone_id = result[0].gid;

    // Insert shop-zone mapping into ZoneCoordinates (shop_zone)
    const shopZone = await ZoneCoordinates.create({
      shop_id,
      zone_id,
      latitude,
      longitude,
    });

    return res.status(201).json({ message: "Shop assigned to zone successfully", data: shopZone });

  } catch (error) {
    console.error("Error assigning shop to zone:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

