const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const { _id: userId, companyId } = req.user;
    const { onlyUnread } = req.query; // ?onlyUnread=true

    const filter = { userId, companyId };
    if (onlyUnread === "true") {
      filter.isRead = false;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .limit(50); // limit to avoid too many at once

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error.message,
    });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id: userId, companyId } = req.user;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId, companyId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating notification",
      error: error.message,
    });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const { _id: userId, companyId } = req.user;

    await Notification.updateMany(
      { userId, companyId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating notifications",
      error: error.message,
    });
  }
};
