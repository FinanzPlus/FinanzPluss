/**
 * LOAN CONTROLLER - FINANZPLUS AUSTRIA
 * Gestion des simulations et demandes de crédit
 */

const { body, validationResult } = require('express-validator');
const { sendClientConfirmationEmail, sendTeamNotificationEmail, sendTestEmail } = require('../services/emailService');

console.log('📋 [LOAN CONTROLLER] Module chargé avec succès');

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
  console.log('\n🚀 ========================================');
  console.log('🚀 [SUBMIT APPLICATION] Nouvelle demande reçue');
  console.log('🚀 ========================================');
  
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

    console.log(`🚀 [SUBMIT APPLICATION] Client: ${firstName} ${lastName}`);
    console.log(`🚀 [SUBMIT APPLICATION] Email: ${email}`);
    console.log(`🚀 [SUBMIT APPLICATION] Téléphone: ${phone}`);
    console.log(`🚀 [SUBMIT APPLICATION] Montant: €${amount}`);
    console.log(`🚀 [SUBMIT APPLICATION] Durée: ${duration} mois`);
    console.log(`🚀 [SUBMIT APPLICATION] Banque: ${selectedBank?.name || 'Non spécifiée'}`);

    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ [SUBMIT APPLICATION] Erreurs de validation:', errors.array());
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

    console.log('💾 [SUBMIT APPLICATION] Données de la demande préparées');
    // TODO: Insérer en base de données
    // const result = await db.query('INSERT INTO loan_applications ...', application);

    console.log('📧 [SUBMIT APPLICATION] Envoi des emails...');
    
    // Envoyer email de confirmation au client
    try {
      console.log('📧 [SUBMIT APPLICATION] Tentative d\'envoi email client...');
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
      console.log('✅ [SUBMIT APPLICATION] Email client envoyé avec succès');
    } catch (emailError) {
      console.error('❌ [SUBMIT APPLICATION] ERREUR email client:', emailError.message);
      console.error('❌ [SUBMIT APPLICATION] Stack:', emailError.stack);
      // Ne pas bloquer la demande si l'email échoue
    }

    // Envoyer notification à l'équipe
    try {
      console.log('📧 [SUBMIT APPLICATION] Tentative d\'envoi email équipe...');
      await sendTeamNotificationEmail(application);
      console.log('✅ [SUBMIT APPLICATION] Email équipe envoyé avec succès');
    } catch (emailError) {
      console.error('❌ [SUBMIT APPLICATION] ERREUR email équipe:', emailError.message);
      // Ne pas bloquer la demande si l'email échoue
    }

    console.log('✅ [SUBMIT APPLICATION] Demande traitée avec succès');
    console.log('🚀 ========================================\n');

    res.status(201).json({
      success: true,
      message: 'Demande soumise avec succès',
      data: application
    });

  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ [SUBMIT APPLICATION] ERREUR CRITIQUE:');
    console.error('❌ ========================================');
    console.error('❌ [SUBMIT APPLICATION] Message:', error.message);
    console.error('❌ [SUBMIT APPLICATION] Stack:', error.stack);
    console.error('❌ ========================================\n');
    
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


/**
 * ENDPOINT DE TEST - Teste l'envoi d'email via Resend
 * Route: POST /api/loans/test-email
 */
exports.testEmail = async (req, res) => {
  console.log('\n🧪 ========================================');
  console.log('🧪 [TEST EMAIL] Endpoint de test appelé');
  console.log('🧪 ========================================');
  
  try {
    const { email } = req.body;
    
    if (!email) {
      console.error('❌ [TEST EMAIL] Email manquant dans la requête');
      return res.status(400).json({
        success: false,
        message: 'Email requis dans le body de la requête'
      });
    }
    
    console.log(`🧪 [TEST EMAIL] Email destinataire: ${email}`);
    console.log(`🧪 [TEST EMAIL] Variables d'environnement:`);
    console.log(`   - RESEND_API_KEY: ${process.env.RESEND_API_KEY ? '✅ Présente' : '❌ Manquante'}`);
    console.log(`   - EMAIL_FROM: ${process.env.EMAIL_FROM || 'noreply@finanzplus.xyz (par défaut)'}`);
    
    console.log('🧪 [TEST EMAIL] Appel de sendTestEmail...');
    const result = await sendTestEmail(email);
    
    console.log('✅ [TEST EMAIL] Email de test envoyé avec succès!');
    console.log(`✅ [TEST EMAIL] Message ID: ${result.messageId}`);
    console.log('🧪 ========================================\n');
    
    res.status(200).json({
      success: true,
      message: 'Email de test envoyé avec succès',
      messageId: result.messageId,
      config: {
        resendConfigured: !!process.env.RESEND_API_KEY,
        emailFrom: process.env.EMAIL_FROM || 'noreply@finanzplus.xyz'
      }
    });
    
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ [TEST EMAIL] ERREUR:');
    console.error('❌ ========================================');
    console.error('❌ [TEST EMAIL] Message:', error.message);
    console.error('❌ [TEST EMAIL] Stack:', error.stack);
    console.error('❌ ========================================\n');
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email de test',
      error: error.message,
      config: {
        resendConfigured: !!process.env.RESEND_API_KEY,
        emailFrom: process.env.EMAIL_FROM || 'noreply@finanzplus.xyz'
      }
    });
  }
};
