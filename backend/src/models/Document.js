const pool = require('../config/database');

/**
 * Modèle Document
 * Gère les documents téléchargés par les utilisateurs pour leurs demandes de prêt
 */
class Document {
  /**
   * Créer un nouveau document
   */
  static async create(documentData) {
    const {
      user_id,
      loan_request_id,
      document_type,
      file_name,
      file_path,
      file_size,
      mime_type
    } = documentData;

    const query = `
      INSERT INTO documents (
        user_id, loan_request_id, document_type, file_name, 
        file_path, file_size, mime_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      user_id,
      loan_request_id || null,
      document_type,
      file_name,
      file_path,
      file_size,
      mime_type
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Récupérer un document par ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        d.*,
        u.first_name,
        u.last_name,
        u.email,
        lr.loan_amount,
        lr.loan_purpose
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN loan_requests lr ON d.loan_request_id = lr.id
      WHERE d.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Récupérer tous les documents d'un utilisateur
   */
  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT 
        d.*,
        lr.loan_amount,
        lr.loan_purpose,
        lr.status as loan_status
      FROM documents d
      LEFT JOIN loan_requests lr ON d.loan_request_id = lr.id
      WHERE d.user_id = $1
    `;

    const values = [userId];
    let paramCount = 1;

    // Filtrer par type de document
    if (filters.document_type) {
      paramCount++;
      query += ` AND d.document_type = $${paramCount}`;
      values.push(filters.document_type);
    }

    // Filtrer par statut de vérification
    if (filters.verification_status) {
      paramCount++;
      query += ` AND d.verification_status = $${paramCount}`;
      values.push(filters.verification_status);
    }

    // Filtrer par demande de prêt
    if (filters.loan_request_id) {
      paramCount++;
      query += ` AND d.loan_request_id = $${paramCount}`;
      values.push(filters.loan_request_id);
    }

    query += ` ORDER BY d.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Récupérer tous les documents d'une demande de prêt
   */
  static async findByLoanRequestId(loanRequestId) {
    const query = `
      SELECT 
        d.*,
        u.first_name,
        u.last_name,
        u.email
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      WHERE d.loan_request_id = $1
      ORDER BY d.document_type, d.created_at DESC
    `;

    const result = await pool.query(query, [loanRequestId]);
    return result.rows;
  }

  /**
   * Récupérer tous les documents (admin)
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        d.*,
        u.first_name,
        u.last_name,
        u.email,
        lr.loan_amount,
        lr.loan_purpose,
        lr.status as loan_status
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN loan_requests lr ON d.loan_request_id = lr.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 0;

    // Filtrer par statut de vérification
    if (filters.verification_status) {
      paramCount++;
      query += ` AND d.verification_status = $${paramCount}`;
      values.push(filters.verification_status);
    }

    // Filtrer par type de document
    if (filters.document_type) {
      paramCount++;
      query += ` AND d.document_type = $${paramCount}`;
      values.push(filters.document_type);
    }

    // Filtrer par utilisateur
    if (filters.user_id) {
      paramCount++;
      query += ` AND d.user_id = $${paramCount}`;
      values.push(filters.user_id);
    }

    // Tri
    const sortBy = filters.sortBy || 'created_at';
    const order = filters.order || 'DESC';
    query += ` ORDER BY d.${sortBy} ${order}`;

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
   * Mettre à jour le statut de vérification d'un document
   */
  static async updateVerificationStatus(id, status, notes = null, verifiedBy = null) {
    const query = `
      UPDATE documents
      SET 
        verification_status = $1,
        verification_notes = $2,
        verified_by = $3,
        verified_at = CASE WHEN $1 IN ('approved', 'rejected') THEN NOW() ELSE NULL END,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;

    const values = [status, notes, verifiedBy, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Mettre à jour un document
   */
  static async update(id, updates) {
    const allowedFields = ['file_name', 'verification_notes'];
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
      UPDATE documents
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Supprimer un document
   */
  static async delete(id) {
    const query = 'DELETE FROM documents WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Compter les documents par statut de vérification
   */
  static async countByStatus() {
    const query = `
      SELECT 
        verification_status,
        COUNT(*) as count
      FROM documents
      GROUP BY verification_status
    `;

    const result = await pool.query(query);
    return result.rows;
  }

  /**
   * Récupérer les statistiques des documents
   */
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_documents,
        COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN verification_status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected_count,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT loan_request_id) as unique_loan_requests,
        SUM(file_size) as total_storage_bytes,
        AVG(file_size) as avg_file_size
      FROM documents
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }

  /**
   * Vérifier si un utilisateur a téléchargé un type de document spécifique
   */
  static async hasDocumentType(userId, documentType) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM documents 
        WHERE user_id = $1 AND document_type = $2
      ) as exists
    `;

    const result = await pool.query(query, [userId, documentType]);
    return result.rows[0].exists;
  }

  /**
   * Récupérer les documents en attente de vérification
   */
  static async findPendingVerification(limit = 50) {
    const query = `
      SELECT 
        d.*,
        u.first_name,
        u.last_name,
        u.email,
        lr.loan_amount,
        lr.loan_purpose
      FROM documents d
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN loan_requests lr ON d.loan_request_id = lr.id
      WHERE d.verification_status = 'pending'
      ORDER BY d.created_at ASC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  }
}

module.exports = Document;

// Made with Bob
