/**
 * LOAN CONTROLLER - FINANZPLUS AUSTRIA
 * Gestion des simulations et demandes de crédit
 */

const { body, validationResult } = require('express-validator');
const { sendClientConfirmationEmail, sendTeamNotificationEmail } = require('../services/emailService');

/**
 * Sauvegarde une simulation de crédit
 */
exports.saveSimulation = async (req, res) => {
  try {
    const {
      amount,
      duration,
      purpose,
      selectedBank,
      monthlyPayment,
      totalAmount,
      totalInterest,
      effectiveRate
    } = req.body;

    // Validation
    if (!amount || !duration || !selectedBank) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes'
      });
    }

    // Si l'utilisateur est connecté, sauvegarder en base de données
    if (req.user) {
      const simulation = {
        user_id: req.user.id,
        amount,
        duration,
        purpose,
        bank_name: selectedBank.name,
        bank_rate: selectedBank.rate,
        monthly_payment: monthlyPayment,
        total_amount: totalAmount,
        total_interest: totalInterest,
        effective_rate: effectiveRate,
        status: 'draft',
        created_at: new Date()
      };

      // TODO: Insérer en base de données PostgreSQL
      // const result = await db.query('INSERT INTO loan_simulations ...', simulation);

      return res.status(201).json({
        success: true,
        message: 'Simulation sauvegardée',
        data: simulation
      });
    }

    // Sinon, retourner succès (sauvegarde locale côté client)
    res.status(200).json({
      success: true,
      message: 'Simulation créée (locale)'
    });

  } catch (error) {
    console.error('Erreur saveSimulation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Récupère les simulations de l'utilisateur
 */
exports.getUserSimulations = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }

    // TODO: Récupérer depuis PostgreSQL
    // const simulations = await db.query('SELECT * FROM loan_simulations WHERE user_id = $1', [req.user.id]);

    res.status(200).json({
      success: true,
      data: [] // Remplacer par les vraies données
    });

  } catch (error) {
    console.error('Erreur getUserSimulations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

/**
 * Soumet une demande de crédit complète
 */
exports.submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      amount,
      duration,
      purpose,
      selectedBank,
      monthlyPayment,
      totalAmount
    } = req.body;

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Sauvegarder la demande
    const application = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      amount,
      duration,
      purpose,
      bank_name: selectedBank.name,
      bank_rate: selectedBank.rate,
      monthly_payment: monthlyPayment,
      total_amount: totalAmount,
      status: 'pending',
      created_at: new Date()
    };

    // TODO: Insérer en base de données
    // const result = await db.query('INSERT INTO loan_applications ...', application);

    // Envoyer email de confirmation au client
    await sendClientConfirmationEmail({
      firstName,
      lastName,
      email,
      amount,
      duration,
      selectedBank,
      monthlyPayment,
      purpose
    });

    // Envoyer notification à l'équipe
    await sendTeamNotificationEmail(application);

    res.status(201).json({
      success: true,
      message: 'Demande soumise avec succès',
      data: application
    });

  } catch (error) {
    console.error('Erreur submitApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la soumission',
      error: error.message
    });
  }
};


/**
 * Envoie un email de confirmation simple
 */
exports.sendConfirmation = async (req, res) => {
  try {
    const { email, firstName, lastName, simulationData } = req.body;

    if (!email || !firstName) {
      return res.status(400).json({
        success: false,
        message: 'Email et prénom requis'
      });
    }

    await sendClientConfirmationEmail({
      firstName,
      lastName,
      email,
      ...simulationData
    });

    res.status(200).json({
      success: true,
      message: 'Email de confirmation envoyé'
    });

  } catch (error) {
    console.error('Erreur sendConfirmation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi',
      error: error.message
    });
  }
};

/**
 * Validation rules pour les demandes
 */
exports.validateApplication = [
  body('firstName').trim().notEmpty().withMessage('Prénom requis'),
  body('lastName').trim().notEmpty().withMessage('Nom requis'),
  body('email').isEmail().withMessage('Email valide requis'),
  body('phone').trim().notEmpty().withMessage('Téléphone requis'),
  body('amount').isNumeric().withMessage('Montant invalide'),
  body('duration').isNumeric().withMessage('Durée invalide')
];

// Made with ❤️ by Bob for FinanzPlus Austria
