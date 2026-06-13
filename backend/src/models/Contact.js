const pool = require('../config/database');

class Contact {
  // Get all opening hours
  static async getOpeningHours() {
    const query = `
      SELECT * FROM opening_hours
      ORDER BY day_of_week
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get opening hours for a specific day
  static async getOpeningHoursByDay(dayOfWeek) {
    const query = 'SELECT * FROM opening_hours WHERE day_of_week = $1';
    const result = await pool.query(query, [dayOfWeek]);
    return result.rows[0];
  }

  // Update opening hours
  static async updateOpeningHours(dayOfWeek, hoursData) {
    const { open_time, close_time, is_closed } = hoursData;

    const query = `
      UPDATE opening_hours
      SET open_time = $1, close_time = $2, is_closed = $3, updated_at = CURRENT_TIMESTAMP
      WHERE day_of_week = $4
      RETURNING *
    `;

    const result = await pool.query(query, [open_time, close_time, is_closed, dayOfWeek]);
    return result.rows[0];
  }

  // Check if currently open
  static async isCurrentlyOpen() {
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const query = `
      SELECT * FROM opening_hours
      WHERE day_of_week = $1
        AND is_closed = false
        AND open_time <= $2
        AND close_time >= $2
    `;

    const result = await pool.query(query, [currentDay, currentTime]);
    return result.rows.length > 0;
  }

  // Create contact message
  static async createContactMessage(messageData) {
    const {
      name,
      email,
      phone,
      subject,
      message,
      user_id
    } = messageData;

    const query = `
      INSERT INTO contact_messages (name, email, phone, subject, message, user_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `;

    const values = [name, email, phone, subject, message, user_id || null];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Get all contact messages (admin)
  static async getAllMessages(filters = {}) {
    let query = 'SELECT * FROM contact_messages';
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (filters.status) {
      conditions.push(`status = $${paramCount}`);
      values.push(filters.status);
      paramCount++;
    }

    if (filters.user_id) {
      conditions.push(`user_id = $${paramCount}`);
      values.push(filters.user_id);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, values);
    return result.rows;
  }

  // Get contact message by ID
  static async getMessageById(id) {
    const query = 'SELECT * FROM contact_messages WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update message status
  static async updateMessageStatus(id, status, adminNotes = null) {
    const query = `
      UPDATE contact_messages
      SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [status, adminNotes, id]);
    return result.rows[0];
  }

  // Delete contact message
  static async deleteMessage(id) {
    const query = 'DELETE FROM contact_messages WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Get pending messages count
  static async getPendingCount() {
    const query = `
      SELECT COUNT(*) as count
      FROM contact_messages
      WHERE status = 'pending'
    `;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }

  // Get user's messages
  static async getUserMessages(userId) {
    const query = `
      SELECT * FROM contact_messages
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // Initialize default opening hours (for setup)
  static async initializeOpeningHours() {
    const defaultHours = [
      { day: 'monday', open: '09:00', close: '18:00', closed: false },
      { day: 'tuesday', open: '09:00', close: '18:00', closed: false },
      { day: 'wednesday', open: '09:00', close: '18:00', closed: false },
      { day: 'thursday', open: '09:00', close: '18:00', closed: false },
      { day: 'friday', open: '09:00', close: '18:00', closed: false },
      { day: 'saturday', open: '10:00', close: '14:00', closed: false },
      { day: 'sunday', open: '00:00', close: '00:00', closed: true }
    ];

    const query = `
      INSERT INTO opening_hours (day_of_week, open_time, close_time, is_closed)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (day_of_week) DO NOTHING
    `;

    for (const hours of defaultHours) {
      await pool.query(query, [hours.day, hours.open, hours.close, hours.closed]);
    }

    return true;
  }
}

module.exports = Contact;

// Made with Bob
