const Comment = require('../models/Comment');

// Get comments for a product
exports.getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await Comment.getByProduct(productId);
    
    // Get rating statistics
    const stats = await Comment.getAverageRating(productId);
    const distribution = await Comment.getRatingDistribution(productId);

    res.json({
      comments,
      stats: {
        ...stats,
        distribution
      }
    });
  } catch (error) {
    console.error('Error fetching product comments:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Bewertungen' });
  }
};

// Get comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.getById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Bewertung' });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, rating, comment_text } = req.body;

    // Validation
    if (!product_id || !rating || !comment_text) {
      return res.status(400).json({ 
        message: 'Produkt, Bewertung und Kommentar sind erforderlich' 
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        message: 'Die Bewertung muss zwischen 1 und 5 Sternen liegen' 
      });
    }

    if (comment_text.length < 10) {
      return res.status(400).json({ 
        message: 'Der Kommentar muss mindestens 10 Zeichen lang sein' 
      });
    }

    // Check if user has already reviewed this product
    const hasReviewed = await Comment.hasUserReviewed(userId, product_id);
    if (hasReviewed) {
      return res.status(400).json({ 
        message: 'Sie haben dieses Produkt bereits bewertet' 
      });
    }

    const commentData = {
      user_id: userId,
      product_id,
      rating,
      comment_text,
      status: 'pending' // Requires admin approval
    };

    const comment = await Comment.create(commentData);
    res.status(201).json({
      message: 'Ihre Bewertung wurde eingereicht und wartet auf Genehmigung',
      comment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Fehler beim Erstellen der Bewertung' });
  }
};

// Update own comment
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { rating, comment_text } = req.body;

    // Get existing comment
    const existingComment = await Comment.getById(id);
    if (!existingComment) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }

    // Check ownership
    if (existingComment.user_id !== userId) {
      return res.status(403).json({ 
        message: 'Sie können nur Ihre eigenen Bewertungen bearbeiten' 
      });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        message: 'Die Bewertung muss zwischen 1 und 5 Sternen liegen' 
      });
    }

    if (comment_text && comment_text.length < 10) {
      return res.status(400).json({ 
        message: 'Der Kommentar muss mindestens 10 Zeichen lang sein' 
      });
    }

    const updateData = {};
    if (rating) updateData.rating = rating;
    if (comment_text) updateData.comment_text = comment_text;
    updateData.status = 'pending'; // Requires re-approval after edit

    const comment = await Comment.update(id, updateData);
    res.json({
      message: 'Ihre Bewertung wurde aktualisiert und wartet auf Genehmigung',
      comment
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren der Bewertung' });
  }
};

// Delete own comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get existing comment
    const existingComment = await Comment.getById(id);
    if (!existingComment) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }

    // Check ownership
    if (existingComment.user_id !== userId) {
      return res.status(403).json({ 
        message: 'Sie können nur Ihre eigenen Bewertungen löschen' 
      });
    }

    await Comment.delete(id);
    res.json({ message: 'Bewertung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Fehler beim Löschen der Bewertung' });
  }
};

// Get user's own comments
exports.getUserComments = async (req, res) => {
  try {
    const userId = req.user.id;
    const comments = await Comment.getByUser(userId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching user comments:', error);
    res.status(500).json({ message: 'Fehler beim Laden Ihrer Bewertungen' });
  }
};

// Admin: Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const { status, product_id, user_id } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (product_id) filters.product_id = product_id;
    if (user_id) filters.user_id = user_id;

    const comments = await Comment.getAll(filters);
    const pendingCount = await Comment.getPendingCount();

    res.json({
      comments,
      pending_count: pendingCount
    });
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Bewertungen' });
  }
};

// Admin: Update comment status
exports.updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status ist erforderlich' });
    }

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }

    const comment = await Comment.updateStatus(id, status, admin_notes);

    if (!comment) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }

    res.json({
      message: `Bewertung wurde ${status === 'approved' ? 'genehmigt' : 'abgelehnt'}`,
      comment
    });
  } catch (error) {
    console.error('Error updating comment status:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Status' });
  }
};

// Admin: Delete any comment
exports.adminDeleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.delete(id);

    if (!comment) {
      return res.status(404).json({ message: 'Bewertung nicht gefunden' });
    }

    res.json({ message: 'Bewertung erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Fehler beim Löschen der Bewertung' });
  }
};

module.exports = exports;

// Made with Bob
