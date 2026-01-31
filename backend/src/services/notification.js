const Notification = require('../models/Notification');

async function createNotification(userId, type, title, message, relatedOrder = null) {
  try {
    const notification = await Notification.create({
      user_id: userId,
      type: type,
      title: title,
      message: message,
      related_order: relatedOrder
    });
    
    return notification;
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
}

module.exports = { createNotification };