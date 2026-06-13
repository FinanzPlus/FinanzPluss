/**
 * Service WhatsApp
 * Gère l'intégration WhatsApp pour FinanzPlus Austria
 */

class WhatsAppService {
  /**
   * Numéro WhatsApp de FinanzPlus Austria
   * Format international: +43 (Autriche)
   */
  static WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '+43123456789';

  /**
   * Générer un lien WhatsApp avec message pré-rempli
   */
  static generateWhatsAppLink(message, phoneNumber = null) {
    const number = phoneNumber || this.WHATSAPP_NUMBER;
    // Supprimer tous les caractères non numériques sauf le +
    const cleanNumber = number.replace(/[^\d+]/g, '');
    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
  }

  /**
   * Générer un message de demande de prêt
   */
  static generateLoanRequestMessage(loanData) {
    const { amount, duration, purpose, firstName, lastName } = loanData;
    
    const message = `Hallo FinanzPlus Austria Team,

ich interessiere mich für einen Kredit mit folgenden Details:

👤 Name: ${firstName} ${lastName}
💰 Kreditbetrag: €${amount.toLocaleString('de-AT')}
📅 Laufzeit: ${duration} Monate
🎯 Verwendungszweck: ${purpose}

Ich würde gerne mehr Informationen erhalten und einen Beratungstermin vereinbaren.

Vielen Dank!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message de demande d'information générale
   */
  static generateInfoRequestMessage(firstName, lastName, topic = 'Kreditberatung') {
    const message = `Hallo FinanzPlus Austria Team,

ich bin ${firstName} ${lastName} und interessiere mich für ${topic}.

Könnten Sie mir bitte weitere Informationen zukommen lassen?

Vielen Dank!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message de demande de rendez-vous
   */
  static generateAppointmentRequestMessage(userData) {
    const { firstName, lastName, preferredDate, preferredTime, topic } = userData;
    
    const message = `Hallo FinanzPlus Austria Team,

ich möchte gerne einen Beratungstermin vereinbaren:

👤 Name: ${firstName} ${lastName}
📅 Wunschdatum: ${preferredDate || 'Flexibel'}
🕐 Wunschzeit: ${preferredTime || 'Flexibel'}
📋 Thema: ${topic || 'Kreditberatung'}

Bitte bestätigen Sie mir einen passenden Termin.

Vielen Dank!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message de suivi de demande
   */
  static generateFollowUpMessage(requestId, firstName, lastName) {
    const message = `Hallo FinanzPlus Austria Team,

ich möchte mich nach dem Status meiner Kreditanfrage erkundigen:

👤 Name: ${firstName} ${lastName}
🔢 Anfrage-ID: ${requestId}

Könnten Sie mir bitte ein Update geben?

Vielen Dank!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message de demande de documents
   */
  static generateDocumentRequestMessage(firstName, lastName, documentType) {
    const message = `Hallo FinanzPlus Austria Team,

ich habe eine Frage bezüglich der erforderlichen Dokumente:

👤 Name: ${firstName} ${lastName}
📄 Dokument: ${documentType}

Könnten Sie mir bitte helfen?

Vielen Dank!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message de réclamation
   */
  static generateComplaintMessage(firstName, lastName, subject) {
    const message = `Hallo FinanzPlus Austria Team,

ich möchte eine Beschwerde einreichen:

👤 Name: ${firstName} ${lastName}
📋 Betreff: ${subject}

Bitte kontaktieren Sie mich für weitere Details.

Vielen Dank!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message de feedback
   */
  static generateFeedbackMessage(firstName, lastName, rating, comment) {
    const stars = '⭐'.repeat(rating);
    
    const message = `Hallo FinanzPlus Austria Team,

ich möchte Feedback geben:

👤 Name: ${firstName} ${lastName}
${stars} (${rating}/5)

${comment}

Vielen Dank für Ihren Service!`;

    return this.generateWhatsAppLink(message);
  }

  /**
   * Générer un message personnalisé
   */
  static generateCustomMessage(messageText) {
    return this.generateWhatsAppLink(messageText);
  }

  /**
   * Vérifier si un numéro WhatsApp est valide
   */
  static isValidWhatsAppNumber(phoneNumber) {
    // Format international avec indicatif pays
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s-]/g, ''));
  }

  /**
   * Formater un numéro de téléphone pour WhatsApp
   */
  static formatPhoneNumber(phoneNumber) {
    // Supprimer tous les caractères non numériques sauf le +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ajouter + si manquant
    if (!cleaned.startsWith('+')) {
      // Supposer que c'est un numéro autrichien si pas d'indicatif
      if (cleaned.startsWith('0')) {
        cleaned = '+43' + cleaned.substring(1);
      } else {
        cleaned = '+' + cleaned;
      }
    }
    
    return cleaned;
  }

  /**
   * Obtenir le lien WhatsApp Business
   */
  static getBusinessProfileLink() {
    const cleanNumber = this.WHATSAPP_NUMBER.replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanNumber}`;
  }

  /**
   * Générer un QR code WhatsApp (retourne l'URL de l'API)
   */
  static generateQRCodeURL(message = '') {
    const link = message ? this.generateWhatsAppLink(message) : this.getBusinessProfileLink();
    // Utiliser une API de génération de QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
  }

  /**
   * Vérifier les heures d'ouverture pour WhatsApp
   */
  static isWithinBusinessHours() {
    const now = new Date();
    const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
    const hour = now.getHours();
    
    // Lundi à Vendredi: 9h-18h
    if (day >= 1 && day <= 5) {
      return hour >= 9 && hour < 18;
    }
    
    // Samedi: 9h-13h
    if (day === 6) {
      return hour >= 9 && hour < 13;
    }
    
    // Dimanche: Fermé
    return false;
  }

  /**
   * Obtenir le message d'heures d'ouverture
   */
  static getBusinessHoursMessage() {
    return `Unsere WhatsApp-Beratungszeiten:
📅 Montag - Freitag: 09:00 - 18:00 Uhr
📅 Samstag: 09:00 - 13:00 Uhr
📅 Sonntag: Geschlossen

Außerhalb dieser Zeiten antworten wir am nächsten Werktag.`;
  }

  /**
   * Générer un message automatique hors heures d'ouverture
   */
  static generateOutOfHoursMessage(firstName, lastName) {
    const message = `Hallo FinanzPlus Austria Team,

ich bin ${firstName} ${lastName} und möchte Sie kontaktieren.

${this.getBusinessHoursMessage()}

Ich freue mich auf Ihre Rückmeldung!`;

    return this.generateWhatsAppLink(message);
  }
}

module.exports = WhatsAppService;

// Made with Bob
