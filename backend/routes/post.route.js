import express from 'express'
import { createPost, getFeedPosts, deletePost, getPostById, createComment
    , likePost, editPost, deleteComment
 } from '../controllers/post.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getFeedPosts)
router.post('/create', protectRoute, createPost)
router.delete('/delete/:id', protectRoute, deletePost)
router.put('/edit/:id', protectRoute, editPost)
router.get("/:id", protectRoute, getPostById)
router.post('/:id/comment', protectRoute, createComment)
router.post('/:id/like', protectRoute, likePost);
router.delete('/delete/:postId/:commentId/comment', protectRoute, deleteComment)

export default router