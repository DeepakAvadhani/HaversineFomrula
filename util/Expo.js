const { Expo } = require('expo-server-sdk');

const expo = new Expo();

const sendPushNotification = async (pushTokens, title, body, data = {}) => {
  try {
    let messages = [];
    for (let token of pushTokens) {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`Invalid Expo push token: ${token}`);
        continue;
      }

      messages.push({
        to: token,
        sound: 'default',
        title,
        body,
        data,
      });
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log('Push notification sent successfully:', tickets);
    return tickets;
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

module.exports = { sendPushNotification };
