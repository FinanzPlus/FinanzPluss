const { Resend } = require('resend');

// ============================================
// CONFIGURATION RESEND
// ============================================

console.log('📧 [EMAIL SERVICE] Initialisation du service email...');

// Vérifier que la clé API Resend est présente
if (!process.env.RESEND_API_KEY) {
  console.error('❌ [EMAIL SERVICE] ERREUR CRITIQUE: RESEND_API_KEY manquante dans les variables d\'environnement!');
  console.error('❌ [EMAIL SERVICE] Les emails ne pourront pas être envoyés.');
} else {
  console.log('✅ [EMAIL SERVICE] RESEND_API_KEY trouvée');
  console.log(`📧 [EMAIL SERVICE] Clé API: ${process.env.RESEND_API_KEY.substring(0, 10)}...`);
}

// Vérifier que EMAIL_FROM est présente
if (!process.env.EMAIL_FROM) {
  console.error('❌ [EMAIL SERVICE] ERREUR: EMAIL_FROM manquante dans les variables d\'environnement!');
  console.error('❌ [EMAIL SERVICE] Utilisation de l\'adresse par défaut: noreply@finanzplus.xyz');
}

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@finanzplus.xyz';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@finanzplus.xyz';

console.log(`✅ [EMAIL SERVICE] Service Resend initialisé`);
console.log(`📧 [EMAIL SERVICE] Email FROM: ${EMAIL_FROM}`);
console.log(`📧 [EMAIL SERVICE] Email ADMIN: ${ADMIN_EMAIL}`);

// ============================================
// TEMPLATES HTML
// ============================================

/**
 * Template HTML professionnel pour l'email de confirmation client
 */
const getClientConfirmationTemplate = (data) => {
  const { firstName, lastName, email, amount, duration, selectedBank, monthlyPayment, purpose, submittedAt } = data;
  
  console.log(`📧 [TEMPLATE CLIENT] Génération du template pour ${firstName} ${lastName}`);
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kreditanfrage Bestätigung</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0A1628 0%, #1a2d4a 100%); padding: 40px 30px; text-align: center;">
      <div style="font-size: 32px; font-weight: bold; color: #C9A84C; margin-bottom: 10px; letter-spacing: 2px;">FINANZPLUS</div>
      <div style="color: #ffffff; font-size: 14px; opacity: 0.9;">Ihr vertrauenswürdiger Finanzpartner in Österreich</div>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <div style="font-size: 24px; color: #0A1628; margin-bottom: 20px; font-weight: 600;">Sehr geehrte/r ${firstName} ${lastName},</div>
      
      <div style="font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.8;">
        <p>vielen Dank für Ihr Vertrauen in <span style="color: #C9A84C; font-weight: 600;">FinanzPlus Austria</span>!</p>
        <p>Wir haben Ihre Kreditanfrage erfolgreich erhalten und werden diese umgehend bearbeiten. Unser Expertenteam wird Ihre Anfrage sorgfältig prüfen und sich <strong>innerhalb von 24 Stunden</strong> bei Ihnen melden.</p>
      </div>

      <!-- Details Table -->
      <table style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f9f9f9; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 20px; font-size: 15px; font-weight: 600; color: #0A1628; width: 45%;">Ausgewählte Bank</td>
          <td style="padding: 15px 20px; font-size: 15px; color: #555; text-align: right;"><strong>${selectedBank.name}</strong></td>
        </tr>
        <tr style="background-color: #0A1628; color: #C9A84C; border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 20px; font-size: 18px; font-weight: bold;">Kreditbetrag</td>
          <td style="padding: 15px 20px; font-size: 18px; font-weight: bold; text-align: right;">€ ${amount.toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 20px; font-size: 15px; font-weight: 600; color: #0A1628;">Laufzeit</td>
          <td style="padding: 15px 20px; font-size: 15px; color: #555; text-align: right;">${duration} Monate</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 20px; font-size: 15px; font-weight: 600; color: #0A1628;">Zinssatz</td>
          <td style="padding: 15px 20px; font-size: 15px; color: #555; text-align: right;">${selectedBank.rate}% p.a.</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 20px; font-size: 15px; font-weight: 600; color: #0A1628;">Monatliche Rate</td>
          <td style="padding: 15px 20px; font-size: 15px; color: #555; text-align: right;"><strong>€ ${monthlyPayment.toLocaleString('de-AT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 15px 20px; font-size: 15px; font-weight: 600; color: #0A1628;">Verwendungszweck</td>
          <td style="padding: 15px 20px; font-size: 15px; color: #555; text-align: right;">${purpose || 'Nicht angegeben'}</td>
        </tr>
        <tr>
          <td style="padding: 15px 20px; font-size: 15px; font-weight: 600; color: #0A1628;">Eingereicht am</td>
          <td style="padding: 15px 20px; font-size: 15px; color: #555; text-align: right;">${submittedAt}</td>
        </tr>
      </table>

      <!-- Info Box -->
      <div style="background-color: #e8f4f8; border-left: 4px solid #C9A84C; padding: 20px; margin: 30px 0; border-radius: 4px;">
        <p style="margin: 0; color: #0A1628; font-size: 15px;"><strong>📋 Nächste Schritte:</strong></p>
        <p style="margin: 10px 0 0 0; color: #0A1628; font-size: 15px;">Unser Team wird Ihre Bonität prüfen und Ihnen die besten verfügbaren Konditionen anbieten. Sie erhalten in Kürze eine detaillierte Rückmeldung per E-Mail oder Telefon.</p>
      </div>

      <!-- Contact Section -->
      <div style="background-color: #f9f9f9; padding: 30px; margin: 30px 0; border-radius: 8px; text-align: center;">
        <div style="font-size: 20px; color: #0A1628; margin-bottom: 20px; font-weight: 600;">Haben Sie Fragen?</div>
        <div style="display: inline-block; text-align: left; margin: 0 auto;">
          <div style="margin: 10px 0; font-size: 15px; color: #555;">
            <strong style="color: #0A1628; display: inline-block; width: 120px;">📧 E-Mail:</strong> kontakt@finanzplus.at
          </div>
          <div style="margin: 10px 0; font-size: 15px; color: #555;">
            <strong style="color: #0A1628; display: inline-block; width: 120px;">📞 Telefon:</strong> +43 123 456 789
          </div>
          <div style="margin: 10px 0; font-size: 15px; color: #555;">
            <strong style="color: #0A1628; display: inline-block; width: 120px;">🕐 Öffnungszeiten:</strong> Mo-Fr, 09:00-18:00 Uhr
          </div>
        </div>
        <a href="https://wa.me/43123456789?text=Hallo%2C%20ich%20habe%20eine%20Frage%20zu%20meiner%20Kreditanfrage" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin-top: 20px;">
          💬 WhatsApp kontaktieren
        </a>
      </div>

      <div style="font-size: 16px; color: #555; margin-bottom: 30px; line-height: 1.8;">
        <p>Wir freuen uns darauf, Sie bei der Verwirklichung Ihrer Pläne zu unterstützen!</p>
        <p>Mit freundlichen Grüßen,<br><strong>Ihr FinanzPlus Austria Team</strong></p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0A1628; color: #ffffff; padding: 30px; text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #C9A84C; margin-bottom: 15px;">FINANZPLUS</div>
      <div style="font-size: 13px; opacity: 0.8; margin-bottom: 15px;">
        FinanzPlus Austria GmbH<br>
        Hauptstraße 123, 1010 Wien, Österreich<br>
        Tel: +43 123 456 789 | E-Mail: kontakt@finanzplus.at
      </div>
      <div style="margin: 20px 0;">
        <a href="${process.env.FRONTEND_URL}/impressum" style="color: #C9A84C; text-decoration: none; margin: 0 10px; font-size: 13px;">Impressum</a> |
        <a href="${process.env.FRONTEND_URL}/datenschutz" style="color: #C9A84C; text-decoration: none; margin: 0 10px; font-size: 13px;">Datenschutz</a> |
        <a href="${process.env.FRONTEND_URL}/agb" style="color: #C9A84C; text-decoration: none; margin: 0 10px; font-size: 13px;">AGB</a>
      </div>
      <div style="font-size: 12px; opacity: 0.7; margin-top: 15px;">
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
  
  console.log(`📧 [TEMPLATE ÉQUIPE] Génération du template pour nouvelle demande de ${first_name} ${last_name}`);
  
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kreditanfrage</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="background-color: #d32f2f; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">🔔 Neue Kreditanfrage eingegangen!</h1>
    </div>
    <div style="padding: 30px;">
      <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 20px;">
        <strong>⚠️ Aktion erforderlich:</strong> Eine neue Kreditanfrage muss innerhalb von 24 Stunden bearbeitet werden.
      </div>

      <h2>Kundeninformationen</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; width: 40%; color: #0A1628;">Name</td>
          <td style="padding: 12px; font-size: 14px;">${first_name} ${last_name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">E-Mail</td>
          <td style="padding: 12px; font-size: 14px;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Telefon</td>
          <td style="padding: 12px; font-size: 14px;"><a href="tel:${phone}">${phone}</a></td>
        </tr>
      </table>

      <h2>Kreditdetails</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Bank</td>
          <td style="padding: 12px; font-size: 14px;"><strong>${bank_name}</strong></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Kreditbetrag</td>
          <td style="padding: 12px; font-size: 14px;"><strong>€ ${amount.toLocaleString('de-AT', { minimumFractionDigits: 2 })}</strong></td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Laufzeit</td>
          <td style="padding: 12px; font-size: 14px;">${duration} Monate</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Zinssatz</td>
          <td style="padding: 12px; font-size: 14px;">${bank_rate}% p.a.</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Monatliche Rate</td>
          <td style="padding: 12px; font-size: 14px;">€ ${monthly_payment.toLocaleString('de-AT', { minimumFractionDigits: 2 })}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e0e0e0;">
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Verwendungszweck</td>
          <td style="padding: 12px; font-size: 14px;">${purpose || 'Nicht angegeben'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; font-size: 14px; font-weight: bold; color: #0A1628;">Eingereicht am</td>
          <td style="padding: 12px; font-size: 14px;">${new Date(created_at).toLocaleString('de-AT')}</td>
        </tr>
      </table>

      <div style="background-color: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <strong>📊 Nächste Schritte:</strong>
        <ul style="margin: 10px 0; padding-left: 20px;">
          <li>Bonitätsprüfung durchführen</li>
          <li>Kunden innerhalb von 24h kontaktieren</li>
          <li>Angebot erstellen und versenden</li>
        </ul>
      </div>

      <div style="text-align: center;">
        <a href="mailto:${email}" style="display: inline-block; background-color: #0A1628; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Kunde kontaktieren</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

// ============================================
// FONCTIONS D'ENVOI D'EMAIL
// ============================================

/**
 * Envoyer l'email de confirmation au client
 */
const sendClientConfirmationEmail = async (data) => {
  console.log('\n📧 ========================================');
  console.log('📧 [ENVOI EMAIL CLIENT] Début de l\'envoi...');
  console.log('📧 ========================================');
  
  try {
    const { firstName, lastName, email, amount, duration, selectedBank, monthlyPayment, purpose } = data;
    
    console.log(`📧 [ENVOI EMAIL CLIENT] Destinataire: ${email}`);
    console.log(`📧 [ENVOI EMAIL CLIENT] Nom: ${firstName} ${lastName}`);
    console.log(`📧 [ENVOI EMAIL CLIENT] Montant: €${amount}`);
    console.log(`📧 [ENVOI EMAIL CLIENT] Banque: ${selectedBank.name}`);
    
    // Vérifier que l'email est valide
    if (!email || !email.includes('@')) {
      console.error(`❌ [ENVOI EMAIL CLIENT] Email invalide: ${email}`);
      throw new Error(`Email invalide: ${email}`);
    }
    
    // Formater la date et l'heure
    const submittedAt = new Date().toLocaleString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    console.log(`📧 [ENVOI EMAIL CLIENT] Date soumission: ${submittedAt}`);
    console.log(`📧 [ENVOI EMAIL CLIENT] Génération du template HTML...`);
    
    const htmlContent = getClientConfirmationTemplate({
      firstName,
      lastName,
      email,
      amount,
      duration,
      selectedBank,
      monthlyPayment,
      purpose,
      submittedAt
    });
    
    console.log(`📧 [ENVOI EMAIL CLIENT] Template généré (${htmlContent.length} caractères)`);
    console.log(`📧 [ENVOI EMAIL CLIENT] Envoi via Resend...`);
    console.log(`📧 [ENVOI EMAIL CLIENT] FROM: ${EMAIL_FROM}`);
    console.log(`📧 [ENVOI EMAIL CLIENT] TO: ${email}`);
    
    const { data: resendData, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: `Ihre Kreditanfrage wurde erfolgreich eingereicht – FinanzPlus Austria`,
      html: htmlContent
    });
    
    if (error) {
      console.error('❌ [ENVOI EMAIL CLIENT] ERREUR Resend:', error);
      throw error;
    }
    
    console.log('✅ [ENVOI EMAIL CLIENT] Email envoyé avec succès!');
    console.log(`✅ [ENVOI EMAIL CLIENT] ID: ${resendData.id}`);
    console.log('📧 ========================================\n');
    
    return { success: true, messageId: resendData.id };
    
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ [ENVOI EMAIL CLIENT] ERREUR CRITIQUE:');
    console.error('❌ ========================================');
    console.error('❌ [ENVOI EMAIL CLIENT] Message:', error.message);
    console.error('❌ [ENVOI EMAIL CLIENT] Stack:', error.stack);
    console.error('❌ ========================================\n');
    throw error;
  }
};

/**
 * Envoyer la notification à l'équipe interne
 */
const sendTeamNotificationEmail = async (application) => {
  console.log('\n📧 ========================================');
  console.log('📧 [ENVOI EMAIL ÉQUIPE] Début de l\'envoi...');
  console.log('📧 ========================================');
  
  try {
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] Destinataire: ${ADMIN_EMAIL}`);
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] Client: ${application.first_name} ${application.last_name}`);
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] Montant: €${application.amount}`);
    
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] Génération du template HTML...`);
    
    const htmlContent = getTeamNotificationTemplate(application);
    
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] Template généré (${htmlContent.length} caractères)`);
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] Envoi via Resend...`);
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] FROM: ${EMAIL_FROM}`);
    console.log(`📧 [ENVOI EMAIL ÉQUIPE] TO: ${ADMIN_EMAIL}`);
    
    const { data: resendData, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [ADMIN_EMAIL],
      subject: `🔔 Nouvelle demande: ${application.first_name} ${application.last_name} - € ${application.amount.toLocaleString('de-AT')}`,
      html: htmlContent
    });
    
    if (error) {
      console.error('❌ [ENVOI EMAIL ÉQUIPE] ERREUR Resend:', error);
      throw error;
    }
    
    console.log('✅ [ENVOI EMAIL ÉQUIPE] Email envoyé avec succès!');
    console.log(`✅ [ENVOI EMAIL ÉQUIPE] ID: ${resendData.id}`);
    console.log('📧 ========================================\n');
    
    return { success: true, messageId: resendData.id };
    
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ [ENVOI EMAIL ÉQUIPE] ERREUR CRITIQUE:');
    console.error('❌ ========================================');
    console.error('❌ [ENVOI EMAIL ÉQUIPE] Message:', error.message);
    console.error('❌ [ENVOI EMAIL ÉQUIPE] Stack:', error.stack);
    console.error('❌ ========================================\n');
    // Ne pas throw pour ne pas bloquer si l'email équipe échoue
    return { success: false, error: error.message };
  }
};

/**
 * Fonction de test pour vérifier que Resend fonctionne
 */
const sendTestEmail = async (toEmail) => {
  console.log('\n🧪 ========================================');
  console.log('🧪 [TEST EMAIL] Envoi d\'un email de test...');
  console.log('🧪 ========================================');
  
  try {
    console.log(`🧪 [TEST EMAIL] Destinataire: ${toEmail}`);
    console.log(`🧪 [TEST EMAIL] FROM: ${EMAIL_FROM}`);
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [toEmail],
      subject: 'Test Email - FinanzPlus Austria',
      html: '<h1>Test réussi!</h1><p>Si vous recevez cet email, Resend fonctionne correctement.</p>'
    });
    
    if (error) {
      console.error('❌ [TEST EMAIL] ERREUR:', error);
      throw error;
    }
    
    console.log('✅ [TEST EMAIL] Email de test envoyé avec succès!');
    console.log(`✅ [TEST EMAIL] ID: ${data.id}`);
    console.log('🧪 ========================================\n');
    
    return { success: true, messageId: data.id };
    
  } catch (error) {
    console.error('❌ [TEST EMAIL] ERREUR:', error);
    throw error;
  }
};

module.exports = {
  sendClientConfirmationEmail,
  sendTeamNotificationEmail,
  sendTestEmail
};

// Made with Bob
