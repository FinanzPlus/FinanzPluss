/**
 * LOAN CONTROLLER - FINANZPLUS AUSTRIA
 * Gestion des simulations et demandes de crédit
 */

const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

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
      monthlyPayment
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
 * Envoie un email de confirmation au client
 */
const sendClientConfirmationEmail = async (data) => {
  const { firstName, lastName, email, amount, duration, selectedBank, monthlyPayment } = data;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0A1628 0%, #1a2d47 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 28px; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C9A84C; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .info-row:last-child { border-bottom: none; }
        .highlight { background: #C9A84C; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; }
        .highlight .amount { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #C9A84C; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏦 FinanzPlus Austria</h1>
          <p>Bestätigung Ihrer Kreditanfrage</p>
        </div>
        
        <div class="content">
          <h2>Sehr geehrte/r ${firstName} ${lastName},</h2>
          
          <p>Vielen Dank für Ihr Vertrauen in FinanzPlus Austria!</p>
          
          <p>Wir haben Ihre Kreditanfrage erfolgreich erhalten und werden diese umgehend bearbeiten.</p>
          
          <div class="highlight">
            <div>Ihre monatliche Rate</div>
            <div class="amount">€ ${monthlyPayment}</div>
            <div>für ${duration} Monate</div>
          </div>
          
          <div class="info-box">
            <h3>Ihre Kreditdetails</h3>
            <div class="info-row">
              <span>Kreditbetrag:</span>
              <strong>€ ${amount.toLocaleString('de-AT')}</strong>
            </div>
            <div class="info-row">
              <span>Laufzeit:</span>
              <strong>${duration} Monate</strong>
            </div>
            <div class="info-row">
              <span>Gewählte Bank:</span>
              <strong>${selectedBank.name}</strong>
            </div>
            <div class="info-row">
              <span>Zinssatz:</span>
              <strong>${selectedBank.rate}% p.a.</strong>
            </div>
          </div>
          
          <h3>Wie geht es weiter?</h3>
          <ol>
            <li><strong>Prüfung:</strong> Wir prüfen Ihre Anfrage innerhalb von 24 Stunden</li>
            <li><strong>Kontakt:</strong> Ein Berater wird sich telefonisch bei Ihnen melden</li>
            <li><strong>Dokumente:</strong> Wir besprechen die benötigten Unterlagen</li>
            <li><strong>Zusage:</strong> Bei positiver Prüfung erhalten Sie Ihre Kreditzusage</li>
            <li><strong>Auszahlung:</strong> Nach Vertragsunterzeichnung erfolgt die Auszahlung</li>
          </ol>
          
          <p>Bei Fragen erreichen Sie uns:</p>
          <ul>
            <li>📞 Telefon: +43 1 234 5678</li>
            <li>📧 Email: info@finanzplus.at</li>
            <li>💬 WhatsApp: +43 664 123 4567</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://finanzplus.at/mein-konto" class="button">Mein Konto anzeigen</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>FinanzPlus Austria GmbH</strong></p>
          <p>Stephansplatz 1, 1010 Wien</p>
          <p>FN 123456a | UID: ATU12345678</p>
          <p style="margin-top: 15px;">
            Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese Nachricht.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"FinanzPlus Austria" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Bestätigung Ihrer Kreditanfrage - ${amount.toLocaleString('de-AT')}€`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé à:', email);
  } catch (error) {
    console.error('Erreur envoi email client:', error);
    throw error;
  }
};

/**
 * Envoie une notification à l'équipe
 */
const sendTeamNotificationEmail = async (application) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa; }
        .header { background: #0A1628; color: white; padding: 20px; text-align: center; }
        .content { background: white; padding: 20px; }
        .info-row { padding: 10px; border-bottom: 1px solid #e0e0e0; }
        .urgent { background: #ff9800; color: white; padding: 15px; text-align: center; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 Nouvelle demande de crédit</h2>
        </div>
        
        <div class="urgent">
          À traiter dans les 24 heures
        </div>
        
        <div class="content">
          <h3>Informations client</h3>
          <div class="info-row"><strong>Nom:</strong> ${application.first_name} ${application.last_name}</div>
          <div class="info-row"><strong>Email:</strong> ${application.email}</div>
          <div class="info-row"><strong>Téléphone:</strong> ${application.phone}</div>
          
          <h3>Détails du crédit</h3>
          <div class="info-row"><strong>Montant:</strong> € ${application.amount.toLocaleString('de-AT')}</div>
          <div class="info-row"><strong>Durée:</strong> ${application.duration} mois</div>
          <div class="info-row"><strong>Banque:</strong> ${application.bank_name}</div>
          <div class="info-row"><strong>Taux:</strong> ${application.bank_rate}% p.a.</div>
          <div class="info-row"><strong>Mensualité:</strong> € ${application.monthly_payment}</div>
          <div class="info-row"><strong>Objet:</strong> ${application.purpose}</div>
          
          <p style="margin-top: 20px;">
            <strong>Date de soumission:</strong> ${new Date().toLocaleString('de-AT')}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"FinanzPlus System" <${process.env.SMTP_USER}>`,
    to: process.env.TEAM_EMAIL || 'team@finanzplus.at',
    subject: `🔔 Nouvelle demande: ${application.first_name} ${application.last_name} - ${application.amount}€`,
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification équipe envoyée');
  } catch (error) {
    console.error('Erreur envoi notification équipe:', error);
    // Ne pas bloquer si l'email équipe échoue
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
