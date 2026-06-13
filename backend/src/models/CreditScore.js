const pool = require('../config/database');

/**
 * Modèle CreditScore
 * Gère les scores de crédit et l'historique de crédit des utilisateurs
 */
class CreditScore {
  /**
   * Créer ou mettre à jour un score de crédit
   */
  static async upsert(scoreData) {
    const {
      user_id,
      score,
      score_provider,
      credit_history_length_months,
      number_of_active_credits,
      total_debt_amount,
      payment_history_rating,
      debt_to_income_ratio,
      recent_credit_inquiries,
      negative_records,
      assessment_notes
    } = scoreData;

    // Vérifier si un score existe déjà pour cet utilisateur
    const existingScore = await this.findByUserId(user_id);

    if (existingScore) {
      // Mettre à jour le score existant
      const query = `
        UPDATE credit_scores
        SET 
          score = $1,
          score_provider = $2,
          credit_history_length_months = $3,
          number_of_active_credits = $4,
          total_debt_amount = $5,
          payment_history_rating = $6,
          debt_to_income_ratio = $7,
          recent_credit_inquiries = $8,
          negative_records = $9,
          assessment_notes = $10,
          last_updated = NOW(),
          updated_at = NOW()
        WHERE user_id = $11
        RETURNING *
      `;

      const values = [
        score,
        score_provider || 'internal',
        credit_history_length_months || 0,
        number_of_active_credits || 0,
        total_debt_amount || 0,
        payment_history_rating || 'unknown',
        debt_to_income_ratio || null,
        recent_credit_inquiries || 0,
        negative_records || null,
        assessment_notes || null,
        user_id
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    } else {
      // Créer un nouveau score
      const query = `
        INSERT INTO credit_scores (
          user_id, score, score_provider, credit_history_length_months,
          number_of_active_credits, total_debt_amount, payment_history_rating,
          debt_to_income_ratio, recent_credit_inquiries, negative_records,
          assessment_notes, last_updated
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
        RETURNING *
      `;

      const values = [
        user_id,
        score,
        score_provider || 'internal',
        credit_history_length_months || 0,
        number_of_active_credits || 0,
        total_debt_amount || 0,
        payment_history_rating || 'unknown',
        debt_to_income_ratio || null,
        recent_credit_inquiries || 0,
        negative_records || null,
        assessment_notes || null
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
    }
  }

  /**
   * Récupérer le score de crédit d'un utilisateur
   */
  static async findByUserId(userId) {
    const query = `
      SELECT 
        cs.*,
        u.first_name,
        u.last_name,
        u.email,
        u.monthly_income,
        u.monthly_expenses
      FROM credit_scores cs
      LEFT JOIN users u ON cs.user_id = u.id
      WHERE cs.user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Récupérer un score par ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        cs.*,
        u.first_name,
        u.last_name,
        u.email,
        u.monthly_income,
        u.monthly_expenses
      FROM credit_scores cs
      LEFT JOIN users u ON cs.user_id = u.id
      WHERE cs.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Récupérer tous les scores de crédit (admin)
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        cs.*,
        u.first_name,
        u.last_name,
        u.email,
        u.monthly_income,
        u.monthly_expenses
      FROM credit_scores cs
      LEFT JOIN users u ON cs.user_id = u.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 0;

    // Filtrer par plage de score
    if (filters.min_score) {
      paramCount++;
      query += ` AND cs.score >= $${paramCount}`;
      values.push(filters.min_score);
    }

    if (filters.max_score) {
      paramCount++;
      query += ` AND cs.score <= $${paramCount}`;
      values.push(filters.max_score);
    }

    // Filtrer par évaluation de l'historique de paiement
    if (filters.payment_history_rating) {
      paramCount++;
      query += ` AND cs.payment_history_rating = $${paramCount}`;
      values.push(filters.payment_history_rating);
    }

    // Filtrer par fournisseur de score
    if (filters.score_provider) {
      paramCount++;
      query += ` AND cs.score_provider = $${paramCount}`;
      values.push(filters.score_provider);
    }

    // Tri
    const sortBy = filters.sortBy || 'score';
    const order = filters.order || 'DESC';
    query += ` ORDER BY cs.${sortBy} ${order}`;

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
   * Calculer un score de crédit basé sur les données utilisateur
   */
  static calculateScore(userData) {
    let score = 300; // Score de base minimum

    // Facteur 1: Revenu mensuel (max 200 points)
    if (userData.monthly_income) {
      if (userData.monthly_income >= 5000) score += 200;
      else if (userData.monthly_income >= 3000) score += 150;
      else if (userData.monthly_income >= 2000) score += 100;
      else if (userData.monthly_income >= 1500) score += 50;
    }

    // Facteur 2: Ratio dette/revenu (max 150 points)
    if (userData.monthly_income && userData.monthly_expenses) {
      const ratio = userData.monthly_expenses / userData.monthly_income;
      if (ratio <= 0.3) score += 150;
      else if (ratio <= 0.4) score += 120;
      else if (ratio <= 0.5) score += 80;
      else if (ratio <= 0.6) score += 40;
    }

    // Facteur 3: Historique de crédit (max 150 points)
    if (userData.credit_history_length_months) {
      if (userData.credit_history_length_months >= 60) score += 150;
      else if (userData.credit_history_length_months >= 36) score += 120;
      else if (userData.credit_history_length_months >= 24) score += 80;
      else if (userData.credit_history_length_months >= 12) score += 40;
    }

    // Facteur 4: Nombre de crédits actifs (max 100 points)
    if (userData.number_of_active_credits !== undefined) {
      if (userData.number_of_active_credits === 0) score += 100;
      else if (userData.number_of_active_credits === 1) score += 80;
      else if (userData.number_of_active_credits === 2) score += 60;
      else if (userData.number_of_active_credits <= 4) score += 30;
    }

    // Facteur 5: Historique de paiement (max 100 points)
    if (userData.payment_history_rating) {
      if (userData.payment_history_rating === 'excellent') score += 100;
      else if (userData.payment_history_rating === 'good') score += 80;
      else if (userData.payment_history_rating === 'fair') score += 50;
      else if (userData.payment_history_rating === 'poor') score += 20;
    }

    // Pénalités
    if (userData.recent_credit_inquiries > 3) {
      score -= (userData.recent_credit_inquiries - 3) * 10;
    }

    if (userData.negative_records && userData.negative_records.length > 0) {
      score -= userData.negative_records.length * 50;
    }

    // Limiter le score entre 300 et 850
    return Math.max(300, Math.min(850, score));
  }

  /**
   * Obtenir une évaluation textuelle du score
   */
  static getScoreRating(score) {
    if (score >= 750) return 'excellent';
    if (score >= 650) return 'good';
    if (score >= 550) return 'fair';
    if (score >= 450) return 'poor';
    return 'very_poor';
  }

  /**
   * Supprimer un score de crédit
   */
  static async delete(id) {
    const query = 'DELETE FROM credit_scores WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Récupérer les statistiques des scores de crédit
   */
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_scores,
        AVG(score) as average_score,
        MIN(score) as min_score,
        MAX(score) as max_score,
        COUNT(CASE WHEN score >= 750 THEN 1 END) as excellent_count,
        COUNT(CASE WHEN score >= 650 AND score < 750 THEN 1 END) as good_count,
        COUNT(CASE WHEN score >= 550 AND score < 650 THEN 1 END) as fair_count,
        COUNT(CASE WHEN score >= 450 AND score < 550 THEN 1 END) as poor_count,
        COUNT(CASE WHEN score < 450 THEN 1 END) as very_poor_count,
        AVG(debt_to_income_ratio) as avg_debt_to_income_ratio,
        AVG(credit_history_length_months) as avg_credit_history_months
      FROM credit_scores
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Récupérer les utilisateurs avec les meilleurs scores
   */
  static async getTopScores(limit = 10) {
    const query = `
      SELECT 
        cs.*,
        u.first_name,
        u.last_name,
        u.email
      FROM credit_scores cs
      LEFT JOIN users u ON cs.user_id = u.id
      ORDER BY cs.score DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Récupérer les scores nécessitant une mise à jour (plus de 90 jours)
   */
  static async findOutdated(days = 90) {
    const query = `
      SELECT 
        cs.*,
        u.first_name,
        u.last_name,
        u.email
      FROM credit_scores cs
      LEFT JOIN users u ON cs.user_id = u.id
      WHERE cs.last_updated < NOW() - INTERVAL '${days} days'
      ORDER BY cs.last_updated ASC
    `;

    const result = await pool.query(query);
    return result.rows;
  }
}

module.exports = CreditScore;

// Made with Bob
