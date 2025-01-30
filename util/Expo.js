const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const sendPushNotification = async (messages) => {
  try {
    const messageArray = Array.isArray(messages) ? messages : [messages];
        const validMessages = messageArray.filter(message => {
      if (!Expo.isExpoPushToken(message.to)) {
        console.error(`Invalid Expo push token: ${message.to}`);
        return false;
      }
      return true;
    });

    if (validMessages.length === 0) {
      console.log('No valid messages to send');
      return [];
    }

    let chunks = expo.chunkPushNotifications(validMessages);
    let tickets = [];

    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log('Push notification sent successfully:', tickets);
    return tickets;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

module.exports = { sendPushNotification };