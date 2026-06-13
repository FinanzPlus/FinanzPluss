const pool = require('../config/database');

/**
 * Modèle Notification
 * Gère les notifications utilisateur
 */
class Notification {
  /**
   * Créer une nouvelle notification
   */
  static async create(notificationData) {
    const {
      user_id,
      type,
      title,
      message,
      related_entity_type,
      related_entity_id,
      action_url
    } = notificationData;

    const query = `
      INSERT INTO notifications (
        user_id, type, title, message, related_entity_type,
        related_entity_id, action_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      user_id,
      type,
      title,
      message,
      related_entity_type || null,
      related_entity_id || null,
      action_url || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Créer des notifications en masse
   */
  static async createBulk(notifications) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const createdNotifications = [];

      for (const notif of notifications) {
        const query = `
          INSERT INTO notifications (
            user_id, type, title, message, related_entity_type,
            related_entity_id, action_url
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;

        const values = [
          notif.user_id,
          notif.type,
          notif.title,
          notif.message,
          notif.related_entity_type || null,
          notif.related_entity_id || null,
          notif.action_url || null
        ];

        const result = await client.query(query, values);
        createdNotifications.push(result.rows[0]);
      }

      await client.query('COMMIT');
      return createdNotifications;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Récupérer une notification par ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        n.*,
        u.first_name,
        u.last_name,
        u.email
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Récupérer toutes les notifications d'un utilisateur
   */
  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT * FROM notifications
      WHERE user_id = $1
    `;

    const values = [userId];
    let paramCount = 1;

    // Filtrer par type
    if (filters.type) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      values.push(filters.type);
    }

    // Filtrer par statut de lecture
    if (filters.is_read !== undefined) {
      paramCount++;
      query += ` AND is_read = $${paramCount}`;
      values.push(filters.is_read);
    }

    // Tri
    query += ` ORDER BY created_at DESC`;

    // Pagination
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);

      if (filters.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        values.push(filters.offset);
      }
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Récupérer les notifications non lues d'un utilisateur
   */
  static async findUnreadByUserId(userId, limit = 50) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1 AND is_read = false
      ORDER BY created_at DESC
      LIMIT $2
    `;

    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  /**
   * Compter les notifications non lues d'un utilisateur
   */
  static async countUnreadByUserId(userId) {
    const query = `
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = $1 AND is_read = false
    `;

    const result = await pool.query(query, [userId]);
    return parseInt(result.rows[0].count);
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(id) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = NOW(), updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Marquer toutes les notifications d'un utilisateur comme lues
   */
  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = NOW(), updated_at = NOW()
      WHERE user_id = $1 AND is_read = false
      RETURNING *
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Marquer plusieurs notifications comme lues
   */
  static async markMultipleAsRead(notificationIds, userId) {
    const query = `
      UPDATE notifications
      SET is_read = true, read_at = NOW(), updated_at = NOW()
      WHERE id = ANY($1) AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [notificationIds, userId]);
    return result.rows;
  }

  /**
   * Supprimer une notification
   */
  static async delete(id) {
    const query = 'DELETE FROM notifications WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Supprimer toutes les notifications d'un utilisateur
   */
  static async deleteAllByUserId(userId) {
    const query = 'DELETE FROM notifications WHERE user_id = $1 RETURNING *';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Supprimer les notifications lues plus anciennes que X jours
   */
  static async deleteOldRead(days = 30) {
    const query = `
      DELETE FROM notifications
      WHERE is_read = true 
        AND read_at < NOW() - INTERVAL '${days} days'
      RETURNING *
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Récupérer toutes les notifications (admin)
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        n.*,
        u.first_name,
        u.last_name,
        u.email
      FROM notifications n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 0;

    // Filtrer par utilisateur
    if (filters.user_id) {
      paramCount++;
      query += ` AND n.user_id = $${paramCount}`;
      values.push(filters.user_id);
    }

    // Filtrer par type
    if (filters.type) {
      paramCount++;
      query += ` AND n.type = $${paramCount}`;
      values.push(filters.type);
    }

    // Filtrer par statut de lecture
    if (filters.is_read !== undefined) {
      paramCount++;
      query += ` AND n.is_read = $${paramCount}`;
      values.push(filters.is_read);
    }

    // Tri
    const sortBy = filters.sortBy || 'created_at';
    const order = filters.order || 'DESC';
    query += ` ORDER BY n.${sortBy} ${order}`;

    // Pagination
    if (filters.limit) {
      paramCount++;
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);

      if (filters.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        values.push(filters.offset);
      }
    }

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Récupérer les statistiques des notifications
   */
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count,
        COUNT(CASE WHEN is_read = true THEN 1 END) as read_count,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(CASE WHEN type = 'loan_status' THEN 1 END) as loan_status_count,
        COUNT(CASE WHEN type = 'document_verified' THEN 1 END) as document_verified_count,
        COUNT(CASE WHEN type = 'new_message' THEN 1 END) as new_message_count,
        COUNT(CASE WHEN type = 'system' THEN 1 END) as system_count
      FROM notifications
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Récupérer les statistiques par utilisateur
   */
  static async getStatsByUserId(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_notifications,
        COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count,
        COUNT(CASE WHEN is_read = true THEN 1 END) as read_count,
        COUNT(CASE WHEN type = 'loan_status' THEN 1 END) as loan_status_count,
        COUNT(CASE WHEN type = 'document_verified' THEN 1 END) as document_verified_count,
        COUNT(CASE WHEN type = 'new_message' THEN 1 END) as new_message_count,
        COUNT(CASE WHEN type = 'system' THEN 1 END) as system_count
      FROM notifications
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Créer une notification pour tous les utilisateurs (broadcast)
   */
  static async broadcast(notificationData) {
    const { type, title, message, action_url } = notificationData;

    const query = `
      INSERT INTO notifications (user_id, type, title, message, action_url)
      SELECT id, $1, $2, $3, $4
      FROM users
      WHERE role = 'customer'
      RETURNING *
    `;

    const values = [type, title, message, action_url || null];
    const result = await pool.query(query, values);
    return result.rows;
  }
}

module.exports = Notification;

// Made with Bob
