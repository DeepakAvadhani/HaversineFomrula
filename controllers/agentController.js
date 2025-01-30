const axios = require("axios");

const DISTANCE_API_URL = "http://127.0.0.1:3000/api/get-address"; // Replace with your API URL

/**
 * Updates the location of a delivery agent in Redis.
 */
exports.updateLocation = async (req, res) => {
  console.log("Request received:", req.body);
  const { agentId, latitude, longitude, status } = req.body;
  const redisClient = req.app.locals.redisClient;
  if (!agentId || !latitude || !longitude || !status) {
    console.error("Invalid request. Missing agentId, latitude, longitude, or status.");
    return res
      .status(400)
      .send("Invalid request. Provide agentId, latitude, longitude, and status.");
  }
  const location = { lat: latitude, lng: longitude };
  const timestamp = Date.now();
  const agentData = JSON.stringify({ location, timestamp, status });
  try {
    await redisClient.hset("delivery_agents", agentId, agentData);
    console.log(`Agent ${agentId} location updated with status: ${status}`);
    res.status(200).send("Location and status updated successfully.");
  } catch (err) {
    console.error("Error storing agent data in Redis:", err);
    res.status(500).send("Failed to store location.");
  }
};


/**
 * Retrieves delivery agents sorted by distance from a given shop.
 */
/*
exports.getSortedAgents = async (req, res) => {
  const { shopLat, shopLng } = req.query;
  const redisClient = req.app.locals.redisClient;

  if (!shopLat || !shopLng) {
    return res
      .status(400)
      .send("Invalid request. Provide shopLat and shopLng.");
  }

  try {
    const agents = await redisClient.hGetAll("delivery_agents");
    if (!agents || Object.keys(agents).length === 0) {
      return res.status(404).send("No agents available.");
    }
    const currentTime = Date.now();
    console.log("All agents from Redis:", agents);
    const distancePromises = Object.entries(agents)
      .filter(([_, agentData]) => {
        try {
          const { timestamp } = JSON.parse(agentData);
          console.log(`Agent Timestamp: ${timestamp}, Current Time: ${currentTime}, Difference: ${currentTime - timestamp}`);
          return currentTime - timestamp <= 10 * 1000;
        } catch (err) {
          console.error("Error parsing agent data:", err);
          return false;
        }
      })
      .map(async ([agentId, agentData]) => {
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
  } catch (error) {
    console.error("Error calculating distances:", error);
    res.status(500).send("Failed to calculate distances.");
  }
};
exports.getSortedAgents = async (req, res) => {
  const { shopLat, shopLng } = req.query;
  const redisClient = req.app.locals.redisClient;

  if (!shopLat || !shopLng) {
    return res
      .status(400)
      .send("Invalid request. Provide shopLat and shopLng.");
  }

  try {
    const agents = await redisClient.hGetAll("delivery_agents");
    if (!agents || Object.keys(agents).length === 0) {
      return res.status(404).send("No agents available.");
    }
    const currentTime = Date.now();
    console.log("All agents from Redis:", agents);
    const distancePromises = Object.entries(agents)
      .filter(([_, agentData]) => {
        try {
          const { timestamp } = JSON.parse(agentData);
          console.log(`Agent Timestamp: ${timestamp}, Current Time: ${currentTime}, Difference: ${currentTime - timestamp}`);
          return currentTime - timestamp <= 10 * 1000;
        } catch (err) {
          console.error("Error parsing agent data:", err);
          return false;
        }
      })
      .map(async ([agentId, agentData]) => {
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
  } catch (error) {
    console.error("Error calculating distances:", error);
    res.status(500).send("Failed to calculate distances.");
  }
};
*/

//Sorting agents based on the distance and timestamp
exports.getSortedAgents = async (req, res) => {
  const { shopLat, shopLng } = req.query;
  const redisClient = req.app.locals.redisClient;

  if (!shopLat || !shopLng) {
    return res
      .status(400)
      .send("Invalid request. Provide shopLat and shopLng.");
  }
  try {
    const agents = await redisClient.hgetall("delivery_agents");
    if (!agents || Object.keys(agents).length === 0) {
      return res.status(404).send("No agents available.");
    }
    const currentTime = Date.now();
    console.log("All agents from Redis:", agents);
    const DISTANCE_THRESHOLD = 1000;
    const distancePromises = Object.entries(agents)
      .filter(([_, agentData]) => {
        try {
          const { timestamp } = JSON.parse(agentData);
          console.log(
            `Agent Timestamp: ${timestamp}, Current Time: ${currentTime}, Difference: ${currentTime - timestamp}`
          );
          return currentTime - timestamp <= 10 * 1000;
        } catch (err) {
          console.error("Error parsing agent data:", err);
          return false;
        }
      })
      .map(async ([agentId, agentData]) => {
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
    const closeAgents = distances.filter(
      (agent) => agent.distance <= DISTANCE_THRESHOLD
    );
    res.json(closeAgents);
  } catch (error) {
    console.error("Error calculating distances:", error);
    res.status(500).send("Failed to calculate distances.");
  }
};
