const pool = require('../config/database');

class Partner {
  // Récupérer tous les partenaires
  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM partners WHERE 1=1';
      const params = [];
      let paramCount = 1;

      // Filtre actif
      if (filters.active !== undefined) {
        query += ` AND is_active = $${paramCount}`;
        params.push(filters.active);
        paramCount++;
      }

      // Tri
      const sortBy = filters.sortBy || 'display_order';
      const order = filters.order || 'ASC';
      query += ` ORDER BY ${sortBy} ${order}`;

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un partenaire par ID
  static async findById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM partners WHERE id = $1',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Créer un nouveau partenaire
  static async create(partnerData) {
    try {
      const {
        name,
        logo_url,
        description,
        official_website,
        interest_rate_min,
        interest_rate_max,
        min_loan_amount,
        max_loan_amount,
        min_duration_months,
        max_duration_months,
        certifications,
        is_active,
        display_order
      } = partnerData;

      const result = await pool.query(
        `INSERT INTO partners (
          name, logo_url, description, official_website,
          interest_rate_min, interest_rate_max,
          min_loan_amount, max_loan_amount,
          min_duration_months, max_duration_months,
          certifications, is_active, display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          name, logo_url, description, official_website,
          interest_rate_min, interest_rate_max,
          min_loan_amount, max_loan_amount,
          min_duration_months, max_duration_months,
          JSON.stringify(certifications || []),
          is_active !== undefined ? is_active : true,
          display_order || 0
        ]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un partenaire
  static async update(id, partnerData) {
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Construire dynamiquement la requête UPDATE
      Object.keys(partnerData).forEach(key => {
        if (partnerData[key] !== undefined) {
          fields.push(`${key} = $${paramCount}`);
          values.push(key === 'certifications' ? JSON.stringify(partnerData[key]) : partnerData[key]);
          paramCount++;
        }
      });

      if (fields.length === 0) {
        throw new Error('Aucune donnée à mettre à jour');
      }

      values.push(id);
      const query = `
        UPDATE partners 
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un partenaire
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM partners WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les partenaires actifs pour comparaison
  static async findActiveForComparison(amount, duration) {
    try {
      const result = await pool.query(
        `SELECT * FROM partners 
         WHERE is_active = true
         AND min_loan_amount <= $1 
         AND max_loan_amount >= $1
         AND min_duration_months <= $2
         AND max_duration_months >= $2
         ORDER BY interest_rate_min ASC`,
        [amount, duration]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Statistiques des partenaires
  static async getStats() {
    try {
      const result = await pool.query(`
        SELECT 
          COUNT(*) as total_partners,
          COUNT(*) FILTER (WHERE is_active = true) as active_partners,
          AVG(interest_rate_min) as avg_min_rate,
          AVG(interest_rate_max) as avg_max_rate,
          MIN(min_loan_amount) as lowest_min_amount,
          MAX(max_loan_amount) as highest_max_amount
        FROM partners
      `);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Partner;

// Made with Bob
