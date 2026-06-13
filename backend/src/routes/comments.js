const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', commentController.getProductComments);
router.get('/:id', commentController.getCommentById);

// Protected routes (authenticated users)
router.post('/', authenticate, commentController.createComment);
router.put('/:id', authenticate, commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);
router.get('/user/my-comments', authenticate, commentController.getUserComments);

// Admin routes
router.get('/', authenticate, isAdmin, commentController.getAllComments);
router.patch('/:id/status', authenticate, isAdmin, commentController.updateCommentStatus);
router.delete('/:id/admin', authenticate, isAdmin, commentController.adminDeleteComment);

module.exports = router;

// Made with Bob
