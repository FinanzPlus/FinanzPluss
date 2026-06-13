const nodemailer = require('nodemailer');

/**
 * Service Email
 * Gère l'envoi d'emails pour FinanzPlus Austria
 */

class EmailService {
  /**
   * Configuration du transporteur email
   */
  static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true pour 465, false pour autres ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  /**
   * Email par défaut de l'expéditeur
   */
  static FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@finanzplus.at';
  static FROM_NAME = 'FinanzPlus Austria';

  /**
   * Envoyer un email
   */
  static async sendEmail(to, subject, html, text = null) {
    try {
      const mailOptions = {
        from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer les balises HTML d'un texte
   */
  static stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Template de base pour les emails
   */
  static getEmailTemplate(content, title = 'FinanzPlus Austria') {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #0A1628 0%, #1a2d4a 100%);
            color: #C9A84C;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e0e0e0;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #C9A84C;
            color: #0A1628;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 600;
            margin: 20px 0;
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #C9A84C;
            padding: 15px;
            margin: 20px 0;
        }
        .highlight {
            color: #C9A84C;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FinanzPlus Austria</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Ihr vertrauenswürdiger Kreditpartner</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p><strong>FinanzPlus Austria</strong></p>
            <p>Musterstraße 123, 1010 Wien, Österreich</p>
            <p>Tel: +43 1 234 5678 | Email: info@finanzplus.at</p>
            <p style="margin-top: 15px; font-size: 11px;">
                Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese Nachricht.
            </p>
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Email de bienvenue
   */
  static async sendWelcomeEmail(user) {
    const content = `
      <h2>Willkommen bei FinanzPlus Austria!</h2>
      <p>Hallo ${user.first_name} ${user.last_name},</p>
      <p>Vielen Dank für Ihre Registrierung bei FinanzPlus Austria. Wir freuen uns, Sie als neuen Kunden begrüßen zu dürfen!</p>
      
      <div class="info-box">
        <p><strong>Ihre nächsten Schritte:</strong></p>
        <ul>
          <li>Vervollständigen Sie Ihr Profil</li>
          <li>Nutzen Sie unseren Kreditrechner</li>
          <li>Stellen Sie Ihre erste Kreditanfrage</li>
        </ul>
      </div>
      
      <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, 'Willkommen bei FinanzPlus Austria');
    return await this.sendEmail(user.email, 'Willkommen bei FinanzPlus Austria', html);
  }

  /**
   * Email de confirmation de demande de prêt
   */
  static async sendLoanRequestConfirmation(user, loanRequest) {
    const content = `
      <h2>Kreditanfrage erhalten</h2>
      <p>Hallo ${user.first_name} ${user.last_name},</p>
      <p>Wir haben Ihre Kreditanfrage erfolgreich erhalten und werden diese schnellstmöglich bearbeiten.</p>
      
      <div class="info-box">
        <p><strong>Details Ihrer Anfrage:</strong></p>
        <ul>
          <li><span class="highlight">Anfrage-ID:</span> ${loanRequest.id}</li>
          <li><span class="highlight">Kreditbetrag:</span> €${loanRequest.loan_amount.toLocaleString('de-AT')}</li>
          <li><span class="highlight">Laufzeit:</span> ${loanRequest.loan_duration} Monate</li>
          <li><span class="highlight">Verwendungszweck:</span> ${loanRequest.loan_purpose}</li>
        </ul>
      </div>
      
      <p>Wir werden Ihre Anfrage innerhalb von 24-48 Stunden prüfen und uns bei Ihnen melden.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, 'Kreditanfrage bestätigt');
    return await this.sendEmail(user.email, 'Ihre Kreditanfrage wurde erhalten', html);
  }

  /**
   * Email de mise à jour du statut de la demande
   */
  static async sendLoanStatusUpdate(user, loanRequest, newStatus) {
    const statusMessages = {
      'under_review': 'wird derzeit geprüft',
      'approved': 'wurde genehmigt',
      'rejected': 'wurde leider abgelehnt',
      'documents_required': 'benötigt zusätzliche Dokumente'
    };

    const statusMessage = statusMessages[newStatus] || 'wurde aktualisiert';

    const content = `
      <h2>Status Ihrer Kreditanfrage</h2>
      <p>Hallo ${user.first_name} ${user.last_name},</p>
      <p>Der Status Ihrer Kreditanfrage <strong>${statusMessage}</strong>.</p>
      
      <div class="info-box">
        <p><strong>Anfrage-ID:</strong> ${loanRequest.id}</p>
        <p><strong>Neuer Status:</strong> <span class="highlight">${newStatus}</span></p>
      </div>
      
      ${newStatus === 'approved' ? `
        <p>Herzlichen Glückwunsch! Ihr Kredit wurde genehmigt. Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um die nächsten Schritte zu besprechen.</p>
      ` : ''}
      
      ${newStatus === 'documents_required' ? `
        <p>Bitte laden Sie die erforderlichen Dokumente in Ihrem Dashboard hoch, damit wir Ihre Anfrage weiter bearbeiten können.</p>
      ` : ''}
      
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, 'Kreditanfrage Status Update');
    return await this.sendEmail(user.email, `Status Update: Ihre Kreditanfrage ${statusMessage}`, html);
  }

  /**
   * Email de vérification de document
   */
  static async sendDocumentVerificationEmail(user, document, status) {
    const statusMessages = {
      'approved': 'wurde erfolgreich verifiziert',
      'rejected': 'wurde abgelehnt'
    };

    const content = `
      <h2>Dokumentenverifizierung</h2>
      <p>Hallo ${user.first_name} ${user.last_name},</p>
      <p>Ihr Dokument "${document.file_name}" ${statusMessages[status]}.</p>
      
      ${status === 'rejected' && document.verification_notes ? `
        <div class="info-box">
          <p><strong>Grund:</strong> ${document.verification_notes}</p>
        </div>
        <p>Bitte laden Sie ein korrigiertes Dokument hoch.</p>
      ` : ''}
      
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, 'Dokumentenverifizierung');
    return await this.sendEmail(user.email, `Dokumentenverifizierung: ${document.file_name}`, html);
  }

  /**
   * Email de réinitialisation de mot de passe
   */
  static async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const content = `
      <h2>Passwort zurücksetzen</h2>
      <p>Hallo ${user.first_name} ${user.last_name},</p>
      <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
      
      <p style="text-align: center;">
        <a href="${resetUrl}" class="button">Passwort zurücksetzen</a>
      </p>
      
      <div class="info-box">
        <p><strong>Wichtig:</strong> Dieser Link ist nur 1 Stunde gültig.</p>
      </div>
      
      <p>Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, 'Passwort zurücksetzen');
    return await this.sendEmail(user.email, 'Passwort zurücksetzen - FinanzPlus Austria', html);
  }

  /**
   * Email de notification générale
   */
  static async sendNotificationEmail(user, notification) {
    const content = `
      <h2>${notification.title}</h2>
      <p>Hallo ${user.first_name} ${user.last_name},</p>
      <p>${notification.message}</p>
      
      ${notification.action_url ? `
        <p style="text-align: center;">
          <a href="${notification.action_url}" class="button">Mehr erfahren</a>
        </p>
      ` : ''}
      
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, notification.title);
    return await this.sendEmail(user.email, notification.title, html);
  }

  /**
   * Email de contact (réponse automatique)
   */
  static async sendContactConfirmation(contactData) {
    const content = `
      <h2>Vielen Dank für Ihre Nachricht</h2>
      <p>Hallo ${contactData.first_name} ${contactData.last_name},</p>
      <p>Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
      
      <div class="info-box">
        <p><strong>Ihre Nachricht:</strong></p>
        <p>${contactData.message}</p>
      </div>
      
      <p>Unsere Bearbeitungszeit beträgt in der Regel 24 Stunden.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const html = this.getEmailTemplate(content, 'Nachricht erhalten');
    return await this.sendEmail(contactData.email, 'Ihre Nachricht wurde erhalten', html);
  }

  /**
   * Vérifier la configuration email
   */
  static async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Connexion SMTP vérifiée avec succès');
      return true;
    } catch (error) {
      console.error('❌ Erreur de connexion SMTP:', error);
      return false;
    }
  }
}

module.exports = EmailService;

// Made with Bob
