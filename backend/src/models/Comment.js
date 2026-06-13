const pool = require('../config/database');

class Comment {
  // Create a new comment
  static async create(commentData) {
    const {
      user_id,
      product_id,
      rating,
      comment_text,
      status
    } = commentData;

    const query = `
      INSERT INTO comments (user_id, product_id, rating, comment_text, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      user_id,
      product_id,
      rating,
      comment_text,
      status || 'pending'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get all comments for a product
  static async getByProduct(productId, includeAll = false) {
    let query = `
      SELECT c.*, u.first_name, u.last_name, u.email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.product_id = $1
    `;

    // Only show approved comments for public view
    if (!includeAll) {
      query += ` AND c.status = 'approved'`;
    }

    query += ` ORDER BY c.created_at DESC`;

    const result = await pool.query(query, [productId]);
    return result.rows;
  }

  // Get comment by ID
  static async getById(id) {
    const query = `
      SELECT c.*, u.first_name, u.last_name, u.email
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get comments by user
  static async getByUser(userId) {
    const query = `
      SELECT c.*, p.name as product_name
      FROM comments c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Get all comments (admin)
  static async getAll(filters = {}) {
    let query = `
      SELECT c.*, u.first_name, u.last_name, u.email, p.name as product_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      JOIN products p ON c.product_id = p.id
    `;

    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      conditions.push(`c.status = $${paramCount}`);
      values.push(filters.status);
      paramCount++;
    }

    if (filters.product_id) {
      conditions.push(`c.product_id = $${paramCount}`);
      values.push(filters.product_id);
      paramCount++;
    }

    if (filters.user_id) {
      conditions.push(`c.user_id = $${paramCount}`);
      values.push(filters.user_id);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY c.created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Update comment
  static async update(id, commentData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(commentData).forEach(key => {
      if (commentData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(commentData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    values.push(id);
    const query = `
      UPDATE comments
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update comment status (approve/reject)
  static async updateStatus(id, status, adminNotes = null) {
    const query = `
      UPDATE comments
      SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, adminNotes, id]);
    return result.rows[0];
  }

  // Delete comment
  static async delete(id) {
    const query = 'DELETE FROM comments WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get average rating for a product
  static async getAverageRating(productId) {
    const query = `
      SELECT 
        AVG(rating) as average_rating,
        COUNT(*) as total_reviews
      FROM comments
      WHERE product_id = $1 AND status = 'approved'
    `;
    const result = await pool.query(query, [productId]);
    return {
      average_rating: parseFloat(result.rows[0].average_rating) || 0,
      total_reviews: parseInt(result.rows[0].total_reviews) || 0
    };
  }

  // Get rating distribution for a product
  static async getRatingDistribution(productId) {
    const query = `
      SELECT 
        rating,
        COUNT(*) as count
      FROM comments
      WHERE product_id = $1 AND status = 'approved'
      GROUP BY rating
      ORDER BY rating DESC
    `;
    const result = await pool.query(query, [productId]);
    
    // Initialize distribution with all ratings
    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    };

    // Fill in actual counts
    result.rows.forEach(row => {
      distribution[row.rating] = parseInt(row.count);
    });

    return distribution;
  }

  // Check if user has already reviewed a product
  static async hasUserReviewed(userId, productId) {
    const query = `
      SELECT id FROM comments
      WHERE user_id = $1 AND product_id = $2
    `;
    const result = await pool.query(query, [userId, productId]);
    return result.rows.length > 0;
  }

  // Get pending comments count (admin)
  static async getPendingCount() {
    const query = `
      SELECT COUNT(*) as count
      FROM comments
      WHERE status = 'pending'
    `;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Comment;

// Made with Bob
