const User = require('../models/User');
const { generateTokens } = require('../config/jwt');

/**
 * Inscription d'un nouvel utilisateur
 */
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validation basique
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Validation du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    // Créer l'utilisateur
    const { user, verificationToken } = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: 'customer'
    });

    // Générer les tokens JWT
    const tokens = generateTokens(user);

    // TODO: Envoyer l'email de vérification avec verificationToken
    // await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        ...tokens
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'inscription'
    });
  }
};

/**
 * Connexion d'un utilisateur
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si le compte est actif
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé. Contactez l\'administrateur.'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer les tokens
    const tokens = generateTokens(user);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          emailVerified: user.email_verified
        },
        ...tokens
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

/**
 * Vérification de l'email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.verifyEmail(token);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token de vérification invalide ou expiré'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès',
      data: { user }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification de l\'email'
    });
  }
};

/**
 * Demande de réinitialisation du mot de passe
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    const result = await User.generatePasswordResetToken(email);

    if (!result) {
      // Ne pas révéler si l'email existe ou non pour des raisons de sécurité
      return res.status(200).json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
      });
    }

    // TODO: Envoyer l'email de réinitialisation
    // await sendPasswordResetEmail(result.user.email, result.resetToken);

    res.status(200).json({
      success: true,
      message: 'Un email de réinitialisation a été envoyé.'
    });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la demande de réinitialisation'
    });
  }
};

/**
 * Réinitialisation du mot de passe
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères'
      });
    }

    const user = await User.resetPassword(token, password);

    res.status(200).json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès',
      data: { user }
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors de la réinitialisation du mot de passe'
    });
  }
};

/**
 * Obtenir le profil de l'utilisateur connecté
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role,
          emailVerified: user.email_verified,
          createdAt: user.created_at
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

/**
 * Mettre à jour le profil
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const user = await User.updateProfile(req.user.id, {
      firstName,
      lastName,
      phone
    });

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
};

/**
 * Changer le mot de passe
 */
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Ancien et nouveau mot de passe requis'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères'
      });
    }

    await User.changePassword(req.user.id, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erreur lors du changement de mot de passe'
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
};

// Made with Bob
