/**
 * Email Service
 * Service pour l'envoi d'emails avec templates HTML professionnels
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configuration du transporteur email
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true pour 465, false pour autres ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    this.fromEmail = process.env.SMTP_FROM || 'noreply@finanzplus.at';
    this.fromName = 'FinanzPlus Austria';
    this.companyEmail = 'kontakt@finanzplus.at';
    this.companyPhone = '+43 123 456 789';
    this.companyAddress = 'Hauptstraße 123, 1010 Wien, Österreich';
  }

  /**
   * Template HTML de base
   */
  getBaseTemplate(content, title = '') {
    return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #0A1628 0%, #1a2d4a 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #C9A84C;
      margin-bottom: 10px;
    }
    .tagline {
      font-size: 14px;
      color: #e0e0e0;
    }
    .content {
      padding: 40px 30px;
      color: #333;
    }
    .content h2 {
      color: #0A1628;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .content p {
      margin-bottom: 15px;
      color: #555;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: linear-gradient(135deg, #C9A84C 0%, #d4b961 100%);
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .info-box {
      background: #f8f9fa;
      border-left: 4px solid #C9A84C;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .footer a {
      color: #0A1628;
      text-decoration: none;
    }
    .social-links {
      margin: 20px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: #0A1628;
    }
    .divider {
      height: 1px;
      background: #e0e0e0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">FinanzPlus Austria</div>
      <div class="tagline">Ihr vertrauenswürdiger Finanzpartner</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>FinanzPlus Austria GmbH</strong></p>
      <p>${this.companyAddress}</p>
      <p>Tel: ${this.companyPhone} | Email: ${this.companyEmail}</p>
      <div class="divider"></div>
      <p style="font-size: 12px; color: #999;">
        Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 10px;">
        © ${new Date().getFullYear()} FinanzPlus Austria. Alle Rechte vorbehalten.
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
  async sendWelcomeEmail(user) {
    const content = `
      <h2>Willkommen bei FinanzPlus Austria! 🎉</h2>
      <p>Sehr geehrte/r ${user.firstName} ${user.lastName},</p>
      <p>Vielen Dank für Ihre Registrierung bei FinanzPlus Austria. Wir freuen uns, Sie als neuen Kunden begrüßen zu dürfen!</p>
      
      <div class="info-box">
        <p><strong>Ihre Vorteile:</strong></p>
        <ul>
          <li>✓ Zugang zu über 15 österreichischen Banken</li>
          <li>✓ Kostenloser Kreditvergleich</li>
          <li>✓ Persönliche Beratung</li>
          <li>✓ Schnelle Bearbeitung</li>
        </ul>
      </div>

      <p>Sie können sich jetzt anmelden und Ihre erste Kreditanfrage stellen:</p>
      <a href="${process.env.FRONTEND_URL}/login" class="button">Jetzt anmelden</a>

      <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: user.email,
      subject: 'Willkommen bei FinanzPlus Austria! 🎉',
      html: this.getBaseTemplate(content, 'Willkommen')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email de confirmation de demande de prêt
   */
  async sendLoanRequestConfirmation(user, loanRequest) {
    const content = `
      <h2>Ihre Kreditanfrage wurde eingereicht ✅</h2>
      <p>Sehr geehrte/r ${user.firstName} ${user.lastName},</p>
      <p>Wir haben Ihre Kreditanfrage erfolgreich erhalten und werden diese umgehend bearbeiten.</p>
      
      <div class="info-box">
        <p><strong>Details Ihrer Anfrage:</strong></p>
        <p>📋 Anfrage-ID: <strong>${loanRequest.id}</strong></p>
        <p>💰 Betrag: <strong>€${loanRequest.amount.toLocaleString('de-AT')}</strong></p>
        <p>📅 Laufzeit: <strong>${loanRequest.duration} Monate</strong></p>
        <p>🎯 Zweck: <strong>${loanRequest.purpose}</strong></p>
        <p>📊 Status: <strong>${this.getStatusText(loanRequest.status)}</strong></p>
      </div>

      <p><strong>Nächste Schritte:</strong></p>
      <ol>
        <li>Wir prüfen Ihre Anfrage (1-2 Werktage)</li>
        <li>Sie erhalten passende Angebote von unseren Partnerbanken</li>
        <li>Sie wählen das beste Angebot aus</li>
        <li>Wir begleiten Sie bis zur Auszahlung</li>
      </ol>

      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Status verfolgen</a>

      <p>Bei Fragen kontaktieren Sie uns gerne per WhatsApp oder Telefon.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: user.email,
      subject: `Kreditanfrage #${loanRequest.id} eingereicht`,
      html: this.getBaseTemplate(content, 'Anfrage bestätigt')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email de mise à jour de statut
   */
  async sendStatusUpdate(user, loanRequest, newStatus) {
    const statusMessages = {
      'pending': 'Ihre Anfrage wird geprüft',
      'approved': 'Ihre Anfrage wurde genehmigt! 🎉',
      'rejected': 'Leider wurde Ihre Anfrage abgelehnt',
      'completed': 'Ihr Kredit wurde ausgezahlt! ✅'
    };

    const content = `
      <h2>${statusMessages[newStatus]}</h2>
      <p>Sehr geehrte/r ${user.firstName} ${user.lastName},</p>
      <p>Der Status Ihrer Kreditanfrage hat sich geändert.</p>
      
      <div class="info-box">
        <p>📋 Anfrage-ID: <strong>${loanRequest.id}</strong></p>
        <p>📊 Neuer Status: <strong>${this.getStatusText(newStatus)}</strong></p>
        <p>💰 Betrag: <strong>€${loanRequest.amount.toLocaleString('de-AT')}</strong></p>
      </div>

      ${this.getStatusSpecificContent(newStatus, loanRequest)}

      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Details ansehen</a>

      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: user.email,
      subject: `Status-Update: Kreditanfrage #${loanRequest.id}`,
      html: this.getBaseTemplate(content, 'Status-Update')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email de nouveau document requis
   */
  async sendDocumentRequest(user, loanRequest, documents) {
    const content = `
      <h2>Dokumente erforderlich 📄</h2>
      <p>Sehr geehrte/r ${user.firstName} ${user.lastName},</p>
      <p>Für die Bearbeitung Ihrer Kreditanfrage benötigen wir noch folgende Dokumente:</p>
      
      <div class="info-box">
        <p><strong>Erforderliche Dokumente:</strong></p>
        <ul>
          ${documents.map(doc => `<li>📄 ${doc}</li>`).join('')}
        </ul>
      </div>

      <p>Bitte laden Sie die Dokumente in Ihrem Dashboard hoch:</p>
      <a href="${process.env.FRONTEND_URL}/dashboard/documents" class="button">Dokumente hochladen</a>

      <p><strong>Wichtig:</strong> Die Bearbeitung kann erst fortgesetzt werden, wenn alle Dokumente vorliegen.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: user.email,
      subject: 'Dokumente erforderlich - Kreditanfrage',
      html: this.getBaseTemplate(content, 'Dokumente erforderlich')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email de rendez-vous confirmé
   */
  async sendAppointmentConfirmation(user, appointment) {
    const content = `
      <h2>Termin bestätigt ✅</h2>
      <p>Sehr geehrte/r ${user.firstName} ${user.lastName},</p>
      <p>Ihr Beratungstermin wurde erfolgreich bestätigt.</p>
      
      <div class="info-box">
        <p><strong>Termin-Details:</strong></p>
        <p>📅 Datum: <strong>${appointment.date}</strong></p>
        <p>🕐 Uhrzeit: <strong>${appointment.time}</strong></p>
        <p>📍 Ort: <strong>${appointment.location || 'Online (Video-Call)'}</strong></p>
        <p>👤 Berater: <strong>${appointment.advisor || 'Wird noch zugewiesen'}</strong></p>
      </div>

      <p><strong>Bitte bringen Sie mit:</strong></p>
      <ul>
        <li>Personalausweis oder Reisepass</li>
        <li>Einkommensnachweise (letzte 3 Monate)</li>
        <li>Kontoauszüge</li>
      </ul>

      <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Termin verwalten</a>

      <p>Bei Fragen oder Terminänderungen kontaktieren Sie uns bitte rechtzeitig.</p>
      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: user.email,
      subject: 'Termin bestätigt - FinanzPlus Austria',
      html: this.getBaseTemplate(content, 'Termin bestätigt')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email de réinitialisation de mot de passe
   */
  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const content = `
      <h2>Passwort zurücksetzen 🔐</h2>
      <p>Sehr geehrte/r ${user.firstName} ${user.lastName},</p>
      <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt.</p>
      
      <div class="info-box">
        <p><strong>⚠️ Wichtig:</strong></p>
        <p>Dieser Link ist nur 1 Stunde gültig.</p>
        <p>Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.</p>
      </div>

      <a href="${resetUrl}" class="button">Passwort zurücksetzen</a>

      <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
      <p style="word-break: break-all; color: #666; font-size: 12px;">${resetUrl}</p>

      <p>Mit freundlichen Grüßen,<br>Ihr FinanzPlus Austria Team</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: user.email,
      subject: 'Passwort zurücksetzen - FinanzPlus Austria',
      html: this.getBaseTemplate(content, 'Passwort zurücksetzen')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Email de notification admin (nouvelle demande)
   */
  async sendAdminNotification(loanRequest, user) {
    const content = `
      <h2>Neue Kreditanfrage eingegangen 🔔</h2>
      <p>Eine neue Kreditanfrage wurde eingereicht und wartet auf Bearbeitung.</p>
      
      <div class="info-box">
        <p><strong>Kunden-Details:</strong></p>
        <p>👤 Name: <strong>${user.firstName} ${user.lastName}</strong></p>
        <p>📧 Email: <strong>${user.email}</strong></p>
        <p>📞 Telefon: <strong>${user.phone || 'Nicht angegeben'}</strong></p>
      </div>

      <div class="info-box">
        <p><strong>Anfrage-Details:</strong></p>
        <p>📋 ID: <strong>${loanRequest.id}</strong></p>
        <p>💰 Betrag: <strong>€${loanRequest.amount.toLocaleString('de-AT')}</strong></p>
        <p>📅 Laufzeit: <strong>${loanRequest.duration} Monate</strong></p>
        <p>🎯 Zweck: <strong>${loanRequest.purpose}</strong></p>
        <p>📊 Bonität: <strong>${loanRequest.creditScore || 'Noch nicht bewertet'}</strong></p>
      </div>

      <a href="${process.env.FRONTEND_URL}/admin/dashboard" class="button">Anfrage bearbeiten</a>

      <p>Bitte bearbeiten Sie diese Anfrage zeitnah.</p>
    `;

    const mailOptions = {
      from: `"${this.fromName}" <${this.fromEmail}>`,
      to: process.env.ADMIN_EMAIL || 'admin@finanzplus.at',
      subject: `Neue Kreditanfrage #${loanRequest.id}`,
      html: this.getBaseTemplate(content, 'Neue Anfrage')
    };

    return await this.transporter.sendMail(mailOptions);
  }

  /**
   * Helpers
   */
  getStatusText(status) {
    const statusMap = {
      'pending': 'In Bearbeitung',
      'approved': 'Genehmigt',
      'rejected': 'Abgelehnt',
      'completed': 'Abgeschlossen'
    };
    return statusMap[status] || status;
  }

  getStatusSpecificContent(status, loanRequest) {
    switch(status) {
      case 'approved':
        return `
          <p><strong>Herzlichen Glückwunsch!</strong> Ihre Kreditanfrage wurde genehmigt.</p>
          <p>Wir haben passende Angebote von unseren Partnerbanken für Sie zusammengestellt.</p>
          <p>Nächster Schritt: Wählen Sie das beste Angebot aus und schließen Sie den Vertrag ab.</p>
        `;
      case 'rejected':
        return `
          <p>Leider konnten wir für Ihre Anfrage kein passendes Angebot finden.</p>
          <p>Mögliche Gründe:</p>
          <ul>
            <li>Unzureichende Bonität</li>
            <li>Zu hohes Einkommen-zu-Schulden-Verhältnis</li>
            <li>Fehlende Dokumente</li>
          </ul>
          <p>Gerne beraten wir Sie persönlich zu Alternativen.</p>
        `;
      case 'completed':
        return `
          <p><strong>Glückwunsch!</strong> Ihr Kredit wurde erfolgreich ausgezahlt.</p>
          <p>Der Betrag sollte in den nächsten 1-2 Werktagen auf Ihrem Konto sein.</p>
          <p>Ihre monatliche Rate beträgt: <strong>€${loanRequest.monthlyPayment?.toLocaleString('de-AT')}</strong></p>
        `;
      default:
        return '<p>Wir halten Sie über weitere Entwicklungen auf dem Laufenden.</p>';
    }
  }
}

module.exports = new EmailService();

// Made with Bob
