const axios = require('axios');

const DISTANCE_API_URL = 'http://your-distance-api/endpoint';


exports.updateLocation = (req, res) => {
    const { agentId, location } = req.body;
    const redisClient = req.app.locals.redisClient;

    if (!agentId || !location || !location.lat || !location.lng) {
        return res.status(400).send('Invalid request. Provide agentId and location.');
    }

    const timestamp = Date.now();
    const agentData = JSON.stringify({ location, timestamp });

    redisClient.hset('delivery_agents', agentId, agentData, (err) => {
        if (err) {
            console.error('Error storing agent data:', err);
            return res.status(500).send('Failed to store location.');
        }
        res.send('Location updated successfully.');
    });
};


exports.getSortedAgents = async (req, res) => {
    const { shopLat, shopLng } = req.query;
    const redisClient = req.app.locals.redisClient;

    if (!shopLat || !shopLng) {
        return res.status(400).send('Invalid request. Provide shopLat and shopLng.');
    }

    try {
        redisClient.hgetall('delivery_agents', async (err, agents) => {
            if (err) {
                console.error('Error fetching agents:', err);
                return res.status(500).send('Failed to fetch agents.');
            }

            if (!agents) return res.status(404).send('No agents available.');

            const distancePromises = Object.entries(agents).map(async ([agentId, agentData]) => {
                const { location } = JSON.parse(agentData);

                const response = await axios.get(DISTANCE_API_URL, {
                    params: {
                        lat1: shopLat,
                        lng1: shopLng,
                        lat2: location.lat,
                        lng2: location.lng,
                    },
                });

                return {
                    agentId,
                    distance: response.data.distance,
                    location,
                };
            });

            const distances = await Promise.all(distancePromises);

            distances.sort((a, b) => a.distance - b.distance);

            res.json(distances);
        });
    } catch (error) {
        console.error('Error calculating distances:', error);
        res.status(500).send('Failed to calculate distances.');
    }
};
