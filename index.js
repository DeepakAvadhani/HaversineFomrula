const express = require("express");
const app = express();
const port = 3001;

const baseCoordinate = {
  lat: 13.09789368498479, //this is the center point of the circle or zone
  lon: 77.59687312465994,
};

const boundaryZone = [
  {
    lat: 13.09,
    lon: 77.59, //boundary 1
    name: "boundary_point_1",
  },
  {
    lat: 13.11, //boundary 2
    lon: 77.61,
    name: "boundary_point_2",
  },
];

function calculateDistance(lat1, lon1, lat2, lon2) {
  //haversine formula for distance calculation
  const R = 6371; //radius of earth
  const toRadians = (degrees) => degrees * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function isWithinZone(lat, lon, zone, radius = 10) {
  for (const boundary of zone) {
    const distance = calculateDistance(lat, lon, boundary.lat, boundary.lon);
    if (distance <= radius) {
      return true;
    }
  }
  return false;
}

app.use(express.json());

app.post("/getDistances", async (req, res) => {
  try {
    const { points } = req.body;

    if (!points || points.length === 0) {
      return res.status(400).json({ error: "At least one point is required." });
    }

    const results = points.map((point) => {
      const { lat, lon } = point;

      const distance = calculateDistance(
        baseCoordinate.lat,
        baseCoordinate.lon,
        lat,
        lon
      );

      const isWithin = isWithinZone(lat, lon, boundaryZone);

      return {
        point_name: `point_${lon}_${lat}`,
        distance: parseFloat(distance.toFixed(2)),
        is_within_zone: isWithin,
      };
    });

    // Sort results by distance
    results.sort((a, b) => a.distance - b.distance);
    res.json(results);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
