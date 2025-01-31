const { sendPushNotification } = require("../util/Expo");
const { orderAssignment } = require("../models");
const redisClient = require("../config/redisConfig");
const { devicetoken } = require("../models");

exports.saveDeviceToken = async (req, res) => {
  console.log("Received request:", req.body);

  const { user_id, token } = req.body;

  if (!user_id || !token) {
    console.log("Missing fields:", { user_id, token });
    return res.status(400).json({ error: "user_id and token are required" });
  }

  try {
    const savedToken = await registerDeviceToken(user_id, token);
    console.log("Saved token:", savedToken);
    res.status(200).json({ message: "Token registered successfully" });
  } catch (error) {
    console.error("Controller Error:", error.message || error);
    res.status(500).json({ error: "Failed to save token" });
  }
};

const registerDeviceToken = async (userId, token) => {
  try {
    await devicetoken.upsert({ user_id: userId, token });
    return token;
  } catch (error) {
    console.error("Error saving device token:", error);
    throw error;
  }
};

exports.sendNotification = async (req, res) => {
  const { user_id, title, body, data } = req.body;
  try {
    const tokens = await getUserTokens(user_id);
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
    let agentAssignments = [];
    for (let userId in agents) {
      const agentData = JSON.parse(agents[userId]);
      if (agentData.status === "free") {
        const tokens = await getUserTokens(userId);
        if (tokens.length > 0) {
          agentTokens.push(...tokens);
          agentAssignments.push({
            order_id: orderId,
            agent_id: userId,
            status: "pending",
          });
        }
      }
    }
    if (agentTokens.length === 0) {
      return res.status(404).json({ message: "No available agents" });
    }
    await orderAssignment.bulkCreate(agentAssignments);
    const messages = agentTokens.map((token) => ({
      to: token,
      sound: "default",
      title: "New Delivery Request!",
      body: "Tap to accept or decline.",
      data: {
        orderId,
        shopLat,
        shopLng,
        type: "NEW_ORDER",
      },
    }));
    console.log("Sending messages to agents:", messages);
    const result = await sendPushNotification(messages);
    res.status(200).json({
      message: "Notifications sent to available agents.",
      sentTo: agentTokens.length,
      result,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to notify agents" });
  }
};

const getUserTokens = async (userId) => {
  try {
    const tokens = await devicetoken.findAll({
      where: { user_id: userId },
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
  const { userId, orderId } = req.body;
  try {
    const agentData = await redisClient.hget("delivery_agents", userId);
    if (!agentData) {
      return res.status(404).json({ message: "Agent not found" });
    }
    const agent = JSON.parse(agentData);
    if (agent.status !== "free") {
      return res.status(400).json({ message: "Agent is already occupied" });
    }
    const assignment = await orderAssignment.findOne({
      where: { order_id: orderId, agent_id: userId, status: "pending" },
    });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    await assignment.update({ status: "accepted" });
    agent.status = "occupied";
    await redisClient.hset("delivery_agents", userId, JSON.stringify(agent));
    res.status(200).json({
      message: `Agent ${userId} accepted the order and is now occupied`,
    });
  } catch (error) {
    console.error("Error accepting the order:", error);
    res.status(500).json({ error: "Failed to accept order" });
  }
};
