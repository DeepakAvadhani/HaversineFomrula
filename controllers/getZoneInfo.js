const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const Redis = require("ioredis");
const redis = new Redis();

exports.getNearestDeliveryAgents = async (req, res) => {
  const { shopId, shopLatitude, shopLongitude } = req.body;

  if (!shopId || !shopLatitude || !shopLongitude) {
    return res.status(400).json({ error: "Shop ID, Latitude, and Longitude are required." });
  }

  try {
    // Fetch delivery agent locations from Redis
    const deliveryAgents = await redis.lrange("delivery_agents", 0, -1); 
    const agentLocations = deliveryAgents.map(agent => JSON.parse(agent));

    // Calculate distances for each agent
    const distances = agentLocations
      .map(agent => {
        const distance = calculateDistance(shopLatitude, shopLongitude, agent.latitude, agent.longitude);
        return { ...agent, distance };
      })
      .filter(agent => {
        return agent.distance < 1000; // Define SOME_THRESHOLD based on your requirements
      });

    // Sort agents by distance
    const nearestAgents = distances.sort((a, b) => a.distance - b.distance);

    if (nearestAgents.length === 0) {
      return res.status(404).json({ message: "No delivery agents found near the shop." });
    }

    // Optionally return more than one nearest agent
    const numberOfAgentsToReturn = 3; // Define how many agents you want to return
    res.json(nearestAgents.slice(0, numberOfAgentsToReturn)); // Return the closest agents
  } catch (error) {
    console.error("Error fetching delivery agents:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to calculate distance between two geographical points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in meters
  return distance;
};
