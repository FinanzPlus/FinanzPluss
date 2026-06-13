const { query } = require('../config/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

class User {
  /**
   * Créer un nouvel utilisateur
   */
  static async create({ email, password, firstName, lastName, phone, role = 'customer' }) {
    try {
      // Hasher le mot de passe
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Générer un token de vérification
      const verificationToken = uuidv4();

      const sql = `
        INSERT INTO users (email, password_hash, first_name, last_name, phone, role, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, email, first_name, last_name, phone, role, email_verified, created_at
      `;

      const result = await query(sql, [
        email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        phone,
        role,
        verificationToken
      ]);

      return {
        user: result.rows[0],
        verificationToken
      };
    } catch (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        throw new Error('Cet email est déjà utilisé');
      }
      throw error;
    }
  }

  /**
   * Trouver un utilisateur par email
   */
  static async findByEmail(email) {
    const sql = `
      SELECT id, email, password_hash, first_name, last_name, phone, role, 
             email_verified, is_active, created_at, updated_at
      FROM users
      WHERE email = $1
    `;

    const result = await query(sql, [email.toLowerCase()]);
    return result.rows[0] || null;
  }

  /**
   * Trouver un utilisateur par ID
   */
  static async findById(id) {
    const sql = `
      SELECT id, email, first_name, last_name, phone, role, 
             email_verified, is_active, created_at, updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await query(sql, [id]);
    return result.rows[0] || null;
  }

  /**
   * Vérifier le mot de passe
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Vérifier l'email avec le token
   */
  static async verifyEmail(token) {
    const sql = `
      UPDATE users
      SET email_verified = true, verification_token = NULL
      WHERE verification_token = $1
      RETURNING id, email, first_name, last_name
    `;

    const result = await query(sql, [token]);
    return result.rows[0] || null;
  }

  /**
   * Générer un token de réinitialisation de mot de passe
   */
  static async generatePasswordResetToken(email) {
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000); // 1 heure

    const sql = `
      UPDATE users
      SET reset_password_token = $1, reset_password_expires = $2
      WHERE email = $3
      RETURNING id, email, first_name, last_name
    `;

    const result = await query(sql, [resetToken, resetExpires, email.toLowerCase()]);
    
    if (result.rows[0]) {
      return {
        user: result.rows[0],
        resetToken
      };
    }
    return null;
  }

  /**
   * Réinitialiser le mot de passe
   */
  static async resetPassword(token, newPassword) {
    // Vérifier si le token est valide et non expiré
    const checkSql = `
      SELECT id FROM users
      WHERE reset_password_token = $1 
      AND reset_password_expires > NOW()
    `;

    const checkResult = await query(checkSql, [token]);
    
    if (checkResult.rows.length === 0) {
      throw new Error('Token invalide ou expiré');
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour le mot de passe
    const updateSql = `
      UPDATE users
      SET password_hash = $1, 
          reset_password_token = NULL, 
          reset_password_expires = NULL
      WHERE reset_password_token = $2
      RETURNING id, email, first_name, last_name
    `;

    const result = await query(updateSql, [passwordHash, token]);
    return result.rows[0];
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateProfile(userId, { firstName, lastName, phone }) {
    const sql = `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          phone = COALESCE($3, phone)
      WHERE id = $4
      RETURNING id, email, first_name, last_name, phone, role, created_at
    `;

    const result = await query(sql, [firstName, lastName, phone, userId]);
    return result.rows[0];
  }

  /**
   * Changer le mot de passe
   */
  static async changePassword(userId, oldPassword, newPassword) {
    // Récupérer l'utilisateur avec son mot de passe
    const getUserSql = `
      SELECT password_hash FROM users WHERE id = $1
    `;
    const userResult = await query(getUserSql, [userId]);
    
    if (userResult.rows.length === 0) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(oldPassword, userResult.rows[0].password_hash);
    if (!isValid) {
      throw new Error('Ancien mot de passe incorrect');
    }

    // Hasher le nouveau mot de passe
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Mettre à jour
    const updateSql = `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
      RETURNING id, email
    `;

    const result = await query(updateSql, [passwordHash, userId]);
    return result.rows[0];
  }

  /**
   * Obtenir tous les utilisateurs (admin)
   */
  static async getAll(limit = 50, offset = 0) {
    const sql = `
      SELECT id, email, first_name, last_name, phone, role, 
             email_verified, is_active, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await query(sql, [limit, offset]);
    return result.rows;
  }

  /**
   * Compter le nombre total d'utilisateurs
   */
  static async count() {
    const sql = `SELECT COUNT(*) as total FROM users`;
    const result = await query(sql);
    return parseInt(result.rows[0].total);
  }

  /**
   * Activer/Désactiver un utilisateur (admin)
   */
  static async toggleActive(userId) {
    const sql = `
      UPDATE users
      SET is_active = NOT is_active
      WHERE id = $1
      RETURNING id, email, is_active
    `;

    const result = await query(sql, [userId]);
    return result.rows[0];
  }

  /**
   * Supprimer un utilisateur
   */
  static async delete(userId) {
    const sql = `DELETE FROM users WHERE id = $1 RETURNING id`;
    const result = await query(sql, [userId]);
    return result.rows[0];
  }
}

module.exports = User;

// Made with Bob
