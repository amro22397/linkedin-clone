import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { deleteNotification, getUserNotifications, markNotificationsAsRead } from '../controllers/notification.controller.js';

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);

router.put("/:id/read", protectRoute, markNotificationsAsRead)
router.delete("/:id", protectRoute, deleteNotification);


export default router;