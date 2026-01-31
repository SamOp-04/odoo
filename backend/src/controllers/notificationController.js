const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id })
      .populate('related_order')
      .sort({ createdAt: -1 });
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    console.log('📖 Marking notification as read:', req.params.id);
    console.log('👤 User ID:', req.user.id);
    
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      console.log('❌ Notification not found');
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    console.log('📬 Notification found:', {
      _id: notification._id,
      user_id: notification.user_id,
      is_read: notification.is_read
    });
    
    if (notification.user_id.toString() !== req.user.id) {
      console.log('🚫 Access denied - user mismatch');
      return res.status(403).json({ error: 'Access denied' });
    }
    
    notification.is_read = true;
    await notification.save();
    
    console.log('✓ Notification marked as read');
    res.json(notification);
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead
};