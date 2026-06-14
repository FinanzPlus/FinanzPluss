const nodemailer = require('nodemailer');

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true pour 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Vérifier la connexion SMTP au démarrage
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur de configuration SMTP:', error);
  } else {
    console.log('✅ Serveur SMTP prêt à envoyer des emails');
  }
});

/**
 * Template HTML professionnel pour l'email de confirmation client
 */
const getClientConfirmationTemplate = (data) => {
  const { firstName, lastName, email, amount, duration, selectedBank, monthlyPayment, purpose, submittedAt } = data;
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kreditanfrage Bestätigung</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #0A1628 0%, #1a2d4a 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #C9A84C;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    .header-subtitle {
      color: #ffffff;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 24px;
      color: #0A1628;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .message {
      font-size: 16px;
      color: #555;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    .highlight {
      color: #C9A84C;
      font-weight: 600;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
      background-color: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .details-table tr {
      border-bottom: 1px solid #e0e0e0;
    }
    .details-table tr:last-child {
      border-bottom: none;
    }
    .details-table td {
      padding: 15px 20px;
      font-size: 15px;
    }
    .details-table td:first-child {
      font-weight: 600;
      color: #0A1628;
      width: 45%;
    }
    .details-table td:last-child {
      color: #555;
      text-align: right;
    }
    .amount-highlight {
      background-color: #0A1628;
      color: #C9A84C;
      font-weight: bold;
      font-size: 18px;
    }
    .info-box {
      background-color: #e8f4f8;
      border-left: 4px solid #C9A84C;
      padding: 20px;
      margin: 30px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      color: #0A1628;
      font-size: 15px;
    }
    .contact-section {
      background-color: #f9f9f9;
      padding: 30px;
      margin: 30px 0;
      border-radius: 8px;
      text-align: center;
    }
    .contact-title {
      font-size: 20px;
      color: #0A1628;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .contact-info {
      display: inline-block;
      text-align: left;
      margin: 0 auto;
    }
    .contact-item {
      margin: 10px 0;
      font-size: 15px;
      color: #555;
    }
    .contact-item strong {
      color: #0A1628;
      display: inline-block;
      width: 120px;
    }
    .whatsapp-button {
      display: inline-block;
      background-color: #25D366;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 25px;
      font-weight: 600;
      margin-top: 20px;
      transition: background-color 0.3s;
    }
    .whatsapp-button:hover {
      background-color: #20BA5A;
    }
    .footer {
      background-color: #0A1628;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .footer-logo {
      font-size: 24px;
      font-weight: bold;
      color: #C9A84C;
      margin-bottom: 15px;
    }
    .footer-address {
      font-size: 13px;
      opacity: 0.8;
      margin-bottom: 15px;
    }
    .footer-links {
      margin: 20px 0;
    }
    .footer-links a {
      color: #C9A84C;
      text-decoration: none;
      margin: 0 10px;
      font-size: 13px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    .copyright {
      font-size: 12px;
      opacity: 0.7;
      margin-top: 15px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .greeting {
        font-size: 20px;
      }
      .details-table td {
        padding: 12px 15px;
        font-size: 14px;
      }
      .contact-section {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">FINANZPLUS</div>
      <div class="header-subtitle">Ihr vertrauenswürdiger Finanzpartner in Österreich</div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">Sehr geehrte/r ${firstName} ${lastName},</div>
      
      <div class="message">
        <p>vielen Dank für Ihr Vertrauen in <span class="highlight">FinanzPlus Austria</span>!</p>
        <br>
        <p>Wir haben Ihre Kreditanfrage erfolgreich erhalten und werden diese umgehend bearbeiten. Unser Expertenteam wird Ihre Anfrage sorgfältig prüfen und sich <strong>innerhalb von 24 Stunden</strong> bei Ihnen melden.</p>
      </div>

      <!-- Details Table -->
      <table class="details-table">
        <tr>
          <td>Ausgewählte Bank</td>
          <td><strong>${selectedBank.name}</strong></td>
        </tr>
        <tr class="amount-highlight">
          <td>Kreditbetrag</td>
          <td>€ ${amount.toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Laufzeit</td>
          <td>${duration} Monate</td>
        </tr>
        <tr>
          <td>Zinssatz</td>
          <td>${selectedBank.rate}% p.a.</td>
        </tr>
        <tr>
          <td>Monatliche Rate</td>
          <td><strong>€ ${monthlyPayment.toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
        </tr>
        <tr>
          <td>Verwendungszweck</td>
          <td>${purpose || 'Nicht angegeben'}</td>
        </tr>
        <tr>
          <td>Eingereicht am</td>
          <td>${submittedAt}</td>
        </tr>
      </table>

      <!-- Info Box -->
      <div class="info-box">
        <p><strong>📋 Nächste Schritte:</strong></p>
        <p>Unser Team wird Ihre Bonität prüfen und Ihnen die besten verfügbaren Konditionen anbieten. Sie erhalten in Kürze eine detaillierte Rückmeldung per E-Mail oder Telefon.</p>
      </div>

      <!-- Contact Section -->
      <div class="contact-section">
        <div class="contact-title">Haben Sie Fragen?</div>
        <div class="contact-info">
          <div class="contact-item">
            <strong>📧 E-Mail:</strong> kontakt@finanzplus.at
          </div>
          <div class="contact-item">
            <strong>📞 Telefon:</strong> +43 123 456 789
          </div>
          <div class="contact-item">
            <strong>🕐 Öffnungszeiten:</strong> Mo-Fr, 09:00-18:00 Uhr
          </div>
        </div>
        <a href="https://wa.me/43123456789?text=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20meiner%20Kreditanfrage" class="whatsapp-button">
          💬 WhatsApp kontaktieren
        </a>
      </div>

      <div class="message">
        <p>Wir freuen uns darauf, Sie bei der Verwirklichung Ihrer Pläne zu unterstützen!</p>
        <br>
        <p>Mit freundlichen Grüßen,<br>
        <strong>Ihr FinanzPlus Austria Team</strong></p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">FINANZPLUS</div>
      <div class="footer-address">
        FinanzPlus Austria GmbH<br>
        Hauptstraße 123, 1010 Wien, Österreich<br>
        Tel: +43 123 456 789 | E-Mail: kontakt@finanzplus.at
      </div>
      <div class="footer-links">
        <a href="${process.env.FRONTEND_URL}/impressum">Impressum</a> |
        <a href="${process.env.FRONTEND_URL}/datenschutz">Datenschutz</a> |
        <a href="${process.env.FRONTEND_URL}/agb">AGB</a>
      </div>
      <div class="copyright">
        © ${new Date().getFullYear()} FinanzPlus Austria GmbH. Alle Rechte vorbehalten.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Template HTML pour la notification interne à l'équipe
 */
const getTeamNotificationTemplate = (application) => {
  const { first_name, last_name, email, phone, amount, duration, bank_name, bank_rate, monthly_payment, purpose, created_at } = application;
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kreditanfrage</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #d32f2f;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
    }
    .alert {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin-bottom: 20px;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table tr {
      border-bottom: 1px solid #e0e0e0;
    }
    .info-table td {
      padding: 12px;
      font-size: 14px;
    }
    .info-table td:first-child {
      font-weight: bold;
      width: 40%;
      color: #0A1628;
    }
    .highlight {
      background-color: #e3f2fd;
      padding: 15px;
      border-radius: 4px;
      margin: 20px 0;
    }
    .action-button {
      display: inline-block;
      background-color: #0A1628;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Neue Kreditanfrage eingegangen!</h1>
    </div>
    <div class="content">
      <div class="alert">
        <strong>⚠️ Aktion erforderlich:</strong> Eine neue Kreditanfrage muss innerhalb von 24 Stunden bearbeitet werden.
      </div>

      <h2>Kundeninformationen</h2>
      <table class="info-table">
        <tr>
          <td>Name</td>
          <td>${first_name} ${last_name}</td>
        </tr>
        <tr>
          <td>E-Mail</td>
          <td><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td>Telefon</td>
          <td><a href="tel:${phone}">${phone}</a></td>
        </tr>
      </table>

      <h2>Kreditdetails</h2>
      <table class="info-table">
        <tr>
          <td>Bank</td>
          <td><strong>${bank_name}</strong></td>
        </tr>
        <tr>
          <td>Kreditbetrag</td>
          <td><strong>€ ${amount.toLocaleString('de-AT', { minimumFractionDigits: 2 })}</strong></td>
        </tr>
        <tr>
          <td>Laufzeit</td>
          <td>${duration} Monate</td>
        </tr>
        <tr>
          <td>Zinssatz</td>
          <td>${bank_rate}% p.a.</td>
        </tr>
        <tr>
          <td>Monatliche Rate</td>
          <td>€ ${monthly_payment.toLocaleString('de-AT', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr>
          <td>Verwendungszweck</td>
          <td>${purpose || 'Nicht angegeben'}</td>
        </tr>
        <tr>
          <td>Eingereicht am</td>
          <td>${new Date(created_at).toLocaleString('de-AT')}</td>
        </tr>
      </table>

      <div class="highlight">
        <strong>📊 Nächste Schritte:</strong>
        <ul>
          <li>Bonitätsprüfung durchführen</li>
          <li>Kunden innerhalb von 24h kontaktieren</li>
          <li>Angebot erstellen und versenden</li>
        </ul>
      </div>

      <center>
        <a href="mailto:${email}" class="action-button">Kunde kontaktieren</a>
      </center>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Envoyer l'email de confirmation au client
 */
const sendClientConfirmationEmail = async (data) => {
  try {
    const { firstName, lastName, email, amount, duration, selectedBank, monthlyPayment, purpose } = data;
    
    // Formater la date et l'heure
    const submittedAt = new Date().toLocaleString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: `"FinanzPlus Austria" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: `Ihre Kreditanfrage wurde erfolgreich eingereicht – FinanzPlus Austria`,
      html: getClientConfirmationTemplate({
        firstName,
        lastName,
        email,
        amount,
        duration,
        selectedBank,
        monthlyPayment,
        purpose,
        submittedAt
      }),
      // Version texte pour les clients email qui ne supportent pas HTML
      text: `
Sehr geehrte/r ${firstName} ${lastName},

vielen Dank für Ihr Vertrauen in FinanzPlus Austria!

Wir haben Ihre Kreditanfrage erfolgreich erhalten und werden diese umgehend bearbeiten.

Details Ihrer Anfrage:
- Bank: ${selectedBank.name}
- Kreditbetrag: € ${amount.toLocaleString('de-AT')}
- Laufzeit: ${duration} Monate
- Zinssatz: ${selectedBank.rate}% p.a.
- Monatliche Rate: € ${monthlyPayment.toLocaleString('de-AT')}
- Eingereicht am: ${submittedAt}

Unser Team wird sich innerhalb von 24 Stunden bei Ihnen melden.

Bei Fragen erreichen Sie uns:
E-Mail: kontakt@finanzplus.at
Telefon: +43 123 456 789
Öffnungszeiten: Mo-Fr, 09:00-18:00 Uhr

Mit freundlichen Grüßen,
Ihr FinanzPlus Austria Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation envoyé au client:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email client:', error);
    throw error;
  }
};

/**
 * Envoyer la notification à l'équipe interne
 */
const sendTeamNotificationEmail = async (application) => {
  try {
    const mailOptions = {
      from: `"FinanzPlus System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'admin@finanzplus.at',
      subject: `🔔 Neue Kreditanfrage: ${application.first_name} ${application.last_name} - € ${application.amount.toLocaleString('de-AT')}`,
      html: getTeamNotificationTemplate(application),
      text: `
NEUE KREDITANFRAGE EINGEGANGEN

Kunde: ${application.first_name} ${application.last_name}
E-Mail: ${application.email}
Telefon: ${application.phone}

Kreditdetails:
- Bank: ${application.bank_name}
- Betrag: € ${application.amount.toLocaleString('de-AT')}
- Laufzeit: ${application.duration} Monate
- Zinssatz: ${application.bank_rate}% p.a.
- Monatliche Rate: € ${application.monthly_payment.toLocaleString('de-AT')}
- Verwendungszweck: ${application.purpose || 'Nicht angegeben'}

Eingereicht am: ${new Date(application.created_at).toLocaleString('de-AT')}

AKTION ERFORDERLICH: Kunde innerhalb von 24h kontaktieren!
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Notification envoyée à l\'équipe:', info.messageId);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de la notification équipe:', error);
    throw error;
  }
};

module.exports = {
  sendClientConfirmationEmail,
  sendTeamNotificationEmail,
  transporter
};

// Made with Bob
