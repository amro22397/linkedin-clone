import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getPublicProfile, getSuggestedConnections, updateProfile,
    getUsers, getSearchUsers, DeleteUser
 } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/suggestions', protectRoute, getSuggestedConnections);
router.get('/search', protectRoute, getSearchUsers);
router.get('/', protectRoute, getUsers);
router.get("/:username", protectRoute, getPublicProfile)

router.put('/profile', protectRoute, updateProfile)
router.delete('/delete/:id', protectRoute, DeleteUser)

export default router;