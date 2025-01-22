const axios = require("axios");

const DISTANCE_API_URL = "http://127.0.0.1:3000/api/get-address"; // Replace with your API URL

/**
 * Updates the location of a delivery agent in Redis.
 */
exports.updateLocation = (req, res) => {
  const { agentId, location } = req.body;
  const redisClient = req.app.locals.redisClient;

  if (!agentId || !location || !location.lat || !location.lng) {
    return res.status(400).send("Invalid request. Provide agentId and location.");
  }

  const timestamp = Date.now();
  const agentData = JSON.stringify({ location, timestamp });

  redisClient.hSet("delivery_agents", agentId, agentData, (err) => {
    if (err) {
      console.error("Error storing agent data:", err);
      return res.status(500).send("Failed to store location.");
    }
    res.send("Location updated successfully.");
  });
};

/**
 * Retrieves delivery agents sorted by distance from a given shop.
 */
exports.getSortedAgents = async (req, res) => {
  const { shopLat, shopLng } = req.query;
  const redisClient = req.app.locals.redisClient;

  if (!shopLat || !shopLng) {
    return res.status(400).send("Invalid request. Provide shopLat and shopLng.");
  }

  try {
    redisClient.hgetall("delivery_agents", async (err, agents) => {
      if (err) {
        console.error("Error fetching agents:", err);
        return res.status(500).send("Failed to fetch agents.");
      }

      if (!agents) return res.status(404).send("No agents available.");

      const distancePromises = Object.entries(agents).map(async ([agentId, agentData]) => {
        const { location } = JSON.parse(agentData);

        const response = await axios.post(DISTANCE_API_URL, {
          startLat: shopLat,
          startLng: shopLng,
          latitude: location.lat,
          longitude: location.lng,
        });

        const distanceElement = response.data.rows[0].elements[0];

        if (distanceElement.status !== "OK") {
          throw new Error(`Failed to calculate distance for agent ${agentId}`);
        }

        return {
          agentId,
          distance: distanceElement.distance.value,
          distanceText: distanceElement.distance.text,
          duration: distanceElement.duration.value,
          durationText: distanceElement.duration.text,
          location,
        };
      });

      const distances = await Promise.all(distancePromises);

      distances.sort((a, b) => a.distance - b.distance);

      res.json(distances);
    });
  } catch (error) {
    console.error("Error calculating distances:", error);
    res.status(500).send("Failed to calculate distances.");
  }
};

