/**
 * WhatsApp Integration Service
 * Service pour gérer les interactions WhatsApp avec messages pré-remplis en allemand
 */

class WhatsAppService {
  constructor() {
    // Numéro WhatsApp Business de FinanzPlus Austria
    this.phoneNumber = '+4368110535900'; // À remplacer par le vrai numéro
    this.baseUrl = 'https://wa.me/';
  }

  /**
   * Encode le message pour l'URL WhatsApp
   */
  encodeMessage(message) {
    return encodeURIComponent(message);
  }

  /**
   * Ouvre WhatsApp avec un message pré-rempli
   */
  openWhatsApp(message) {
    const encodedMessage = this.encodeMessage(message);
    const url = `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  }

  /**
   * Message pour demande de prêt général
   */
  sendLoanInquiry(loanData = {}) {
    const { amount = '', purpose = '', duration = '' } = loanData;
    
    let message = `Guten Tag FinanzPlus Austria Team! 👋\n\n`;
    message += `Ich interessiere mich für einen Kredit und möchte gerne mehr Informationen erhalten.\n\n`;
    
    if (amount) {
      message += `💰 Gewünschter Betrag: €${amount.toLocaleString('de-AT')}\n`;
    }
    if (purpose) {
      message += `🎯 Verwendungszweck: ${purpose}\n`;
    }
    if (duration) {
      message += `📅 Laufzeit: ${duration} Monate\n`;
    }
    
    message += `\nIch würde mich über eine persönliche Beratung freuen.\n\n`;
    message += `Mit freundlichen Grüßen`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour demande de rendez-vous
   */
  sendAppointmentRequest(appointmentData = {}) {
    const { date = '', time = '', type = 'Beratung' } = appointmentData;
    
    let message = `Guten Tag! 👋\n\n`;
    message += `Ich möchte gerne einen Termin für eine ${type} vereinbaren.\n\n`;
    
    if (date) {
      message += `📅 Gewünschtes Datum: ${date}\n`;
    }
    if (time) {
      message += `🕐 Gewünschte Uhrzeit: ${time}\n`;
    }
    
    message += `\nBitte bestätigen Sie mir die Verfügbarkeit.\n\n`;
    message += `Vielen Dank und freundliche Grüße`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour question générale
   */
  sendGeneralQuestion(question = '') {
    let message = `Guten Tag FinanzPlus Austria Team! 👋\n\n`;
    message += `Ich habe eine Frage:\n\n`;
    
    if (question) {
      message += `${question}\n\n`;
    }
    
    message += `Ich freue mich auf Ihre Antwort.\n\n`;
    message += `Mit freundlichen Grüßen`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour demande de rappel
   */
  sendCallbackRequest(contactData = {}) {
    const { name = '', phone = '', preferredTime = '' } = contactData;
    
    let message = `Guten Tag! 👋\n\n`;
    message += `Ich möchte gerne zurückgerufen werden.\n\n`;
    
    if (name) {
      message += `👤 Name: ${name}\n`;
    }
    if (phone) {
      message += `📞 Telefonnummer: ${phone}\n`;
    }
    if (preferredTime) {
      message += `🕐 Bevorzugte Zeit: ${preferredTime}\n`;
    }
    
    message += `\nVielen Dank im Voraus!\n\n`;
    message += `Mit freundlichen Grüßen`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour suivi de demande
   */
  sendFollowUp(requestId = '') {
    let message = `Guten Tag! 👋\n\n`;
    message += `Ich möchte mich nach dem Status meiner Kreditanfrage erkundigen.\n\n`;
    
    if (requestId) {
      message += `📋 Anfrage-ID: ${requestId}\n\n`;
    }
    
    message += `Könnten Sie mir bitte ein Update geben?\n\n`;
    message += `Vielen Dank und freundliche Grüße`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour demande de documents
   */
  sendDocumentRequest(documentType = '') {
    let message = `Guten Tag! 👋\n\n`;
    message += `Ich benötige Informationen zu folgenden Dokumenten:\n\n`;
    
    if (documentType) {
      message += `📄 ${documentType}\n\n`;
    }
    
    message += `Könnten Sie mir bitte helfen?\n\n`;
    message += `Mit freundlichen Grüßen`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour urgence
   */
  sendUrgentRequest(urgentData = {}) {
    const { subject = '', details = '' } = urgentData;
    
    let message = `🚨 DRINGEND 🚨\n\n`;
    message += `Guten Tag FinanzPlus Austria Team!\n\n`;
    
    if (subject) {
      message += `Betreff: ${subject}\n\n`;
    }
    if (details) {
      message += `${details}\n\n`;
    }
    
    message += `Bitte kontaktieren Sie mich so schnell wie möglich.\n\n`;
    message += `Vielen Dank!`;

    this.openWhatsApp(message);
  }

  /**
   * Message pour feedback/avis
   */
  sendFeedback(rating = '', comment = '') {
    let message = `Guten Tag! 👋\n\n`;
    message += `Ich möchte gerne ein Feedback zu Ihrem Service geben:\n\n`;
    
    if (rating) {
      message += `⭐ Bewertung: ${rating}/5\n\n`;
    }
    if (comment) {
      message += `💬 Kommentar:\n${comment}\n\n`;
    }
    
    message += `Vielen Dank für Ihren ausgezeichneten Service!\n\n`;
    message += `Mit freundlichen Grüßen`;

    this.openWhatsApp(message);
  }

  /**
   * Message personnalisé
   */
  sendCustomMessage(message) {
    if (!message || message.trim() === '') {
      message = 'Guten Tag FinanzPlus Austria Team! 👋\n\nIch möchte gerne Kontakt aufnehmen.';
    }
    this.openWhatsApp(message);
  }

  /**
   * Vérifie si WhatsApp est disponible (mobile)
   */
  isWhatsAppAvailable() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Obtient le lien WhatsApp sans l'ouvrir
   */
  getWhatsAppLink(message) {
    const encodedMessage = this.encodeMessage(message);
    return `${this.baseUrl}${this.phoneNumber}?text=${encodedMessage}`;
  }
}

// Export singleton
const whatsappService = new WhatsAppService();
export default whatsappService;

// Made with Bob
