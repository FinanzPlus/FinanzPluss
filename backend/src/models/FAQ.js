const pool = require('../config/database');

/**
 * Modèle FAQ
 * Gère les questions fréquemment posées
 */
class FAQ {
  /**
   * Créer une nouvelle FAQ
   */
  static async create(faqData) {
    const {
      question_de,
      answer_de,
      category,
      display_order
    } = faqData;

    const query = `
      INSERT INTO faqs (
        question_de, answer_de, category, display_order
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      question_de,
      answer_de,
      category || 'general',
      display_order || 0
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Récupérer une FAQ par ID
   */
  static async findById(id) {
    const query = 'SELECT * FROM faqs WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Récupérer toutes les FAQs
   */
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM faqs WHERE 1=1';
    const values = [];
    let paramCount = 0;

    // Filtrer par catégorie
    if (filters.category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      values.push(filters.category);
    }

    // Filtrer par statut actif
    if (filters.is_active !== undefined) {
      paramCount++;
      query += ` AND is_active = $${paramCount}`;
      values.push(filters.is_active);
    }

    // Tri
    const sortBy = filters.sortBy || 'display_order';
    const order = filters.order || 'ASC';
    query += ` ORDER BY ${sortBy} ${order}`;

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
   * Récupérer les FAQs actives par catégorie
   */
  static async findByCategory(category) {
    const query = `
      SELECT * FROM faqs 
      WHERE category = $1 AND is_active = true
      ORDER BY display_order ASC
    `;

    const result = await pool.query(query, [category]);
    return result.rows;
  }

  /**
   * Récupérer toutes les catégories de FAQs
   */
  static async getCategories() {
    const query = `
      SELECT DISTINCT category, COUNT(*) as count
      FROM faqs
      WHERE is_active = true
      GROUP BY category
      ORDER BY category
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Rechercher dans les FAQs
   */
  static async search(searchTerm) {
    const query = `
      SELECT * FROM faqs
      WHERE is_active = true
        AND (
          question_de ILIKE $1
          OR answer_de ILIKE $1
        )
      ORDER BY display_order ASC
    `;

    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  /**
   * Mettre à jour une FAQ
   */
  static async update(id, updates) {
    const allowedFields = [
      'question_de',
      'answer_de',
      'category',
      'display_order',
      'is_active'
    ];

    const fields = [];
    const values = [];
    let paramCount = 0;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('Aucun champ valide à mettre à jour');
    }

    paramCount++;
    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE faqs
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer une FAQ
   */
  static async delete(id) {
    const query = 'DELETE FROM faqs WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Incrémenter le compteur de vues
   */
  static async incrementViewCount(id) {
    const query = `
      UPDATE faqs
      SET view_count = view_count + 1
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Récupérer les FAQs les plus consultées
   */
  static async getMostViewed(limit = 10) {
    const query = `
      SELECT * FROM faqs
      WHERE is_active = true
      ORDER BY view_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  /**
   * Récupérer les statistiques des FAQs
   */
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_faqs,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_faqs,
        COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_faqs,
        COUNT(DISTINCT category) as total_categories,
        SUM(view_count) as total_views,
        AVG(view_count) as avg_views_per_faq
      FROM faqs
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Réorganiser l'ordre d'affichage des FAQs
   */
  static async reorder(faqOrders) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const { id, display_order } of faqOrders) {
        await client.query(
          'UPDATE faqs SET display_order = $1, updated_at = NOW() WHERE id = $2',
          [display_order, id]
        );
      }

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Dupliquer une FAQ
   */
  static async duplicate(id) {
    const faq = await this.findById(id);

    if (!faq) {
      throw new Error('FAQ non trouvée');
    }

    const query = `
      INSERT INTO faqs (
        question_de, answer_de, category, display_order, is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [
      `${faq.question_de} (Copie)`,
      faq.answer_de,
      faq.category,
      faq.display_order + 1,
      false // Désactivée par défaut
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Activer/Désactiver une FAQ
   */
  static async toggleActive(id) {
    const query = `
      UPDATE faqs
      SET is_active = NOT is_active, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = FAQ;

// Made with Bob
