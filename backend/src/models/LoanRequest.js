const pool = require('../config/database');

class LoanRequest {
  // Créer une nouvelle demande de prêt
  static async create(loanData) {
    try {
      const {
        user_id,
        partner_id,
        full_name,
        email,
        phone,
        amount,
        duration_months,
        interest_rate,
        monthly_payment,
        total_amount,
        total_interest,
        purpose,
        purpose_details,
        monthly_income,
        monthly_expenses,
        employment_status,
        ip_address,
        user_agent
      } = loanData;

      const result = await pool.query(
        `INSERT INTO loan_requests (
          user_id, partner_id, full_name, email, phone,
          amount, duration_months, interest_rate,
          monthly_payment, total_amount, total_interest,
          purpose, purpose_details,
          monthly_income, monthly_expenses, employment_status,
          ip_address, user_agent, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *`,
        [
          user_id, partner_id, full_name, email, phone,
          amount, duration_months, interest_rate || 3.00,
          monthly_payment, total_amount, total_interest,
          purpose, purpose_details,
          monthly_income, monthly_expenses, employment_status,
          ip_address, user_agent, 'pending'
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer toutes les demandes avec filtres
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT 
          lr.*,
          u.first_name, u.last_name, u.email as user_email,
          p.name as partner_name
        FROM loan_requests lr
        LEFT JOIN users u ON lr.user_id = u.id
        LEFT JOIN partners p ON lr.partner_id = p.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      // Filtre par statut
      if (filters.status) {
        query += ` AND lr.status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      // Filtre par utilisateur
      if (filters.user_id) {
        query += ` AND lr.user_id = $${paramCount}`;
        params.push(filters.user_id);
        paramCount++;
      }

      // Filtre par partenaire
      if (filters.partner_id) {
        query += ` AND lr.partner_id = $${paramCount}`;
        params.push(filters.partner_id);
        paramCount++;
      }

      // Filtre par date
      if (filters.dateFrom) {
        query += ` AND lr.created_at >= $${paramCount}`;
        params.push(filters.dateFrom);
        paramCount++;
      }

      if (filters.dateTo) {
        query += ` AND lr.created_at <= $${paramCount}`;
        params.push(filters.dateTo);
        paramCount++;
      }

      // Filtre par montant
      if (filters.minAmount) {
        query += ` AND lr.amount >= $${paramCount}`;
        params.push(filters.minAmount);
        paramCount++;
      }

      if (filters.maxAmount) {
        query += ` AND lr.amount <= $${paramCount}`;
        params.push(filters.maxAmount);
        paramCount++;
      }

      // Tri
      const sortBy = filters.sortBy || 'created_at';
      const order = filters.order || 'DESC';
      query += ` ORDER BY lr.${sortBy} ${order}`;

      // Pagination
      if (filters.limit) {
        query += ` LIMIT $${paramCount}`;
        params.push(filters.limit);
        paramCount++;
      }

      if (filters.offset) {
        query += ` OFFSET $${paramCount}`;
        params.push(filters.offset);
        paramCount++;
      }

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer une demande par ID
  static async findById(id) {
    try {
      const result = await pool.query(
        `SELECT 
          lr.*,
          u.first_name, u.last_name, u.email as user_email, u.phone as user_phone,
          p.name as partner_name, p.logo_url as partner_logo
        FROM loan_requests lr
        LEFT JOIN users u ON lr.user_id = u.id
        LEFT JOIN partners p ON lr.partner_id = p.id
        WHERE lr.id = $1`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les demandes d'un utilisateur
  static async findByUserId(userId, filters = {}) {
    try {
      let query = `
        SELECT 
          lr.*,
          p.name as partner_name, p.logo_url as partner_logo
        FROM loan_requests lr
        LEFT JOIN partners p ON lr.partner_id = p.id
        WHERE lr.user_id = $1
      `;
      const params = [userId];
      let paramCount = 2;

      if (filters.status) {
        query += ` AND lr.status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      query += ` ORDER BY lr.created_at DESC`;

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le statut d'une demande
  static async updateStatus(id, status, adminData = {}) {
    try {
      const { admin_notes, rejection_reason, approved_by } = adminData;

      const result = await pool.query(
        `UPDATE loan_requests 
         SET status = $1,
             admin_notes = COALESCE($2, admin_notes),
             rejection_reason = COALESCE($3, rejection_reason),
             approved_by = COALESCE($4, approved_by),
             approved_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [status, admin_notes, rejection_reason, approved_by, id]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Marquer WhatsApp comme envoyé
  static async markWhatsAppSent(id) {
    try {
      const result = await pool.query(
        `UPDATE loan_requests 
         SET whatsapp_sent = true,
             whatsapp_sent_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Statistiques des demandes
  static async getStats(filters = {}) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_requests,
          COUNT(*) FILTER (WHERE status = 'pending') as pending_requests,
          COUNT(*) FILTER (WHERE status = 'in_review') as in_review_requests,
          COUNT(*) FILTER (WHERE status = 'approved') as approved_requests,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected_requests,
          COUNT(*) FILTER (WHERE status = 'completed') as completed_requests,
          COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_requests,
          AVG(amount) as average_amount,
          SUM(amount) as total_amount,
          AVG(duration_months) as average_duration,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as today_requests,
          COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) as month_requests
        FROM loan_requests
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (filters.dateFrom) {
        query += ` AND created_at >= $${paramCount}`;
        params.push(filters.dateFrom);
        paramCount++;
      }

      if (filters.dateTo) {
        query += ` AND created_at <= $${paramCount}`;
        params.push(filters.dateTo);
        paramCount++;
      }

      const result = await pool.query(query, params);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Statistiques par objet de prêt
  static async getStatsByPurpose() {
    try {
      const result = await pool.query(`
        SELECT 
          purpose,
          COUNT(*) as count,
          AVG(amount) as average_amount,
          SUM(amount) as total_amount
        FROM loan_requests
        GROUP BY purpose
        ORDER BY count DESC
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Statistiques par jour (derniers 30 jours)
  static async getStatsByDay(days = 30) {
    try {
      const result = await pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          SUM(amount) as total_amount,
          AVG(amount) as average_amount
        FROM loan_requests
        WHERE created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Compter les demandes
  static async count(filters = {}) {
    try {
      let query = 'SELECT COUNT(*) FROM loan_requests WHERE 1=1';
      const params = [];
      let paramCount = 1;

      if (filters.status) {
        query += ` AND status = $${paramCount}`;
        params.push(filters.status);
        paramCount++;
      }

      if (filters.user_id) {
        query += ` AND user_id = $${paramCount}`;
        params.push(filters.user_id);
        paramCount++;
      }

      const result = await pool.query(query, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une demande (soft delete - changer statut en cancelled)
  static async cancel(id, userId) {
    try {
      const result = await pool.query(
        `UPDATE loan_requests 
         SET status = 'cancelled',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 AND user_id = $2 AND status = 'pending'
         RETURNING *`,
        [id, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LoanRequest;

// Made with Bob
