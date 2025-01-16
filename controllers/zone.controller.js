const { sequelize } = require("../models"); // Adjust the path to your models
const { QueryTypes } = require("sequelize");

exports.getZoneInfo = async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json({ error: "Latitude and Longitude are required." });
  }

  try {
    const query = `
      SELECT 
        z.zone_name,
        ST_Distance(
          ST_Transform(ST_SetSRID(ST_Point(z.longitude, z.latitude), 4326), 32643),
          ST_Transform(ST_SetSRID(ST_Point(:longitude, :latitude), 4326), 32643)
        ) AS distance
      FROM zone_coordinates z
      JOIN map m ON z.zone_id = m.gid
      WHERE ST_Intersects(
        m.geom, 
        ST_Transform(ST_SetSRID(ST_Point(:longitude, :latitude), 4326), 32643)
      )
      ORDER BY distance ASC
      LIMIT 1;
    `;

    const result = await sequelize.query(query, {
      replacements: { latitude, longitude },
      type: QueryTypes.SELECT,
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No zone found for the given coordinates." });
    }

    res.json(result[0]); // Return the first matching zone with distance
  } catch (error) {
    console.error("Error fetching zone info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
