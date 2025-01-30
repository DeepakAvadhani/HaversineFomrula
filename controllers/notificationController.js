const { sendPushNotification } = require("../util/Expo");
const redisClient = require("../config/redisConfig");
const {devicetoken} = require("../models");
exports.saveDeviceToken = async (req, res) => {
  console.log("Received request:", req.body);

  const { agent_id, token } = req.body;

  if (!agent_id || !token) {
    console.log("Missing fields:", { agent_id, token });
    return res.status(400).json({ error: "agent_id and token are required" });
  }

  try {
    const savedToken = await registerDeviceToken(agent_id, token);
    console.log("Saved token:", savedToken);
    res.status(200).json({ message: "Token registered successfully" });
  } catch (error) {
    console.error("Controller Error:", error.message || error);
    res.status(500).json({ error: "Failed to save token" });
  }
};

const registerDeviceToken = async (agentId, token) => {
  try {
    await devicetoken.upsert({ agent_id: agentId, token });
    return token;
  } catch (error) {
    console.error("Error saving device token:", error);
    throw error;
  }
};

exports.sendNotification = async (req, res) => {
  const { agent_id, title, body, data } = req.body;
  try {
    const tokens = await getUserTokens(agent_id);
    console.log("Found tokens:", tokens);
    if (!tokens.length) {
      return res.status(400).json({ message: "No device tokens found for user" });
    }
    const messages = tokens.map(token => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: data || {}
    }));
    console.log("Sending messages:", messages);
    const result = await sendPushNotification(messages);
    res.status(200).json({ 
      message: "Notification sent successfully",
      result 
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
};

exports.assignOrder = async (req, res) => {
  const { orderId, shopLat, shopLng } = req.body;
  try {
    const agents = await redisClient.hgetall("delivery_agents");
    let agentTokens = [];
    for (let agentId in agents) {
      const agentData = JSON.parse(agents[agentId]);
      if (agentData.status === "free") {
        const tokens = await getUserTokens(agentId);
        agentTokens.push(...tokens);
      }
    }
    if (agentTokens.length === 0) {
      return res.status(404).json({ message: "No available agents" });
    }
    const messages = agentTokens.map(token => ({
      to: token,
      sound: "default",
      title: "New Delivery Request!",
      body: "Tap to accept or decline.",
      data: { 
        orderId, 
        shopLat, 
        shopLng,
        type: 'NEW_ORDER'
      }
    }));
    console.log("Sending messages to agents:", messages);
    const result = await sendPushNotification(messages);

    res.status(200).json({ 
      message: "Notifications sent to available agents.",
      sentTo: agentTokens.length,
      result
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to notify agents" });
  }
};

const getUserTokens = async (agentId) => {
  try {
    const tokens = await devicetoken.findAll({
      where: { agent_id: agentId },
      attributes: ['token'],
      raw: true,
    });
    return tokens.map(t => t.token);
  } catch (error) {
    console.error("Error fetching user tokens:", error);
    return [];
  }
};

exports.acceptOrder = async (req, res) => {
  const { agentId, orderId } = req.body;

  try {
    const agentData = await redisClient.hget("delivery_agents", agentId);
    if (!agentData) {
      return res.status(404).json({ message: "Agent not found" });
    }
    const agent = JSON.parse(agentData);
    if (agent.status !== "free") {
      return res.status(400).json({ message: "Agent is already occupied" });
    }
    agent.status = "occupied";
    res.status(200).json({ message: `Agent ${agentId} accepted the order and is now occupied` });
  } catch (error) {
    console.error("Error accepting the order:", error);
    res.status(500).json({ error: "Failed to accept order" });
  }
};
