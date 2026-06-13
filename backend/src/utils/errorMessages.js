/**
 * Error Messages - German (Deutsch)
 * Messages d'erreur en allemand pour le backend
 */

const errorMessages = {
  // Authentication Errors
  auth: {
    invalidCredentials: 'Ungültige Anmeldedaten',
    emailRequired: 'E-Mail-Adresse ist erforderlich',
    passwordRequired: 'Passwort ist erforderlich',
    emailInvalid: 'Ungültige E-Mail-Adresse',
    emailInUse: 'Diese E-Mail-Adresse wird bereits verwendet',
    userNotFound: 'Benutzer nicht gefunden',
    accountDisabled: 'Ihr Konto wurde deaktiviert',
    accountLocked: 'Ihr Konto wurde gesperrt',
    tokenExpired: 'Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an',
    tokenInvalid: 'Ungültiges Authentifizierungstoken',
    unauthorized: 'Sie sind nicht autorisiert, diese Aktion durchzuführen',
    forbidden: 'Zugriff verweigert',
    sessionExpired: 'Ihre Sitzung ist abgelaufen',
    loginRequired: 'Bitte melden Sie sich an',
    passwordWeak: 'Das Passwort ist zu schwach. Mindestens 8 Zeichen, 1 Großbuchstabe, 1 Kleinbuchstabe, 1 Zahl erforderlich',
    passwordMismatch: 'Die Passwörter stimmen nicht überein',
    oldPasswordIncorrect: 'Das alte Passwort ist falsch',
    resetTokenInvalid: 'Ungültiger oder abgelaufener Reset-Token',
    resetTokenExpired: 'Der Reset-Link ist abgelaufen',
    tooManyAttempts: 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut',
    accountNotVerified: 'Bitte verifizieren Sie Ihre E-Mail-Adresse',
    verificationFailed: 'Verifizierung fehlgeschlagen',
    registrationFailed: 'Registrierung fehlgeschlagen'
  },

  // Validation Errors
  validation: {
    required: '{field} ist erforderlich',
    invalid: 'Ungültige {field}',
    tooShort: '{field} ist zu kurz (mindestens {min} Zeichen)',
    tooLong: '{field} ist zu lang (maximal {max} Zeichen)',
    minValue: '{field} muss mindestens {min} sein',
    maxValue: '{field} darf höchstens {max} sein',
    invalidFormat: 'Ungültiges Format für {field}',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    invalidPhone: 'Ungültige Telefonnummer',
    invalidDate: 'Ungültiges Datum',
    invalidUrl: 'Ungültige URL',
    invalidNumber: '{field} muss eine Zahl sein',
    invalidInteger: '{field} muss eine ganze Zahl sein',
    invalidBoolean: '{field} muss wahr oder falsch sein',
    invalidEnum: 'Ungültiger Wert für {field}',
    invalidArray: '{field} muss ein Array sein',
    invalidObject: '{field} muss ein Objekt sein',
    notUnique: '{field} wird bereits verwendet',
    notFound: '{field} nicht gefunden',
    alreadyExists: '{field} existiert bereits',
    mustMatch: '{field} muss mit {other} übereinstimmen',
    mustBeDifferent: '{field} muss sich von {other} unterscheiden',
    invalidRange: '{field} muss zwischen {min} und {max} liegen',
    invalidChoice: 'Ungültige Auswahl für {field}',
    invalidFileType: 'Ungültiger Dateityp. Erlaubt: {types}',
    fileTooLarge: 'Datei zu groß. Maximal {size} erlaubt',
    tooManyFiles: 'Zu viele Dateien. Maximal {max} erlaubt'
  },

  // Loan Request Errors
  loan: {
    amountRequired: 'Kreditbetrag ist erforderlich',
    amountInvalid: 'Ungültiger Kreditbetrag',
    amountTooLow: 'Kreditbetrag zu niedrig (Minimum: €{min})',
    amountTooHigh: 'Kreditbetrag zu hoch (Maximum: €{max})',
    durationRequired: 'Laufzeit ist erforderlich',
    durationInvalid: 'Ungültige Laufzeit',
    durationTooShort: 'Laufzeit zu kurz (Minimum: {min} Monate)',
    durationTooLong: 'Laufzeit zu lang (Maximum: {max} Monate)',
    purposeRequired: 'Verwendungszweck ist erforderlich',
    purposeInvalid: 'Ungültiger Verwendungszweck',
    requestNotFound: 'Kreditanfrage nicht gefunden',
    requestAlreadyExists: 'Sie haben bereits eine aktive Kreditanfrage',
    requestCancelled: 'Diese Kreditanfrage wurde storniert',
    requestExpired: 'Diese Kreditanfrage ist abgelaufen',
    cannotModify: 'Diese Kreditanfrage kann nicht mehr geändert werden',
    cannotCancel: 'Diese Kreditanfrage kann nicht mehr storniert werden',
    insufficientIncome: 'Ihr Einkommen ist für diesen Kreditbetrag nicht ausreichend',
    creditScoreTooLow: 'Ihre Bonität ist für diesen Kredit nicht ausreichend',
    documentsRequired: 'Bitte laden Sie alle erforderlichen Dokumente hoch',
    documentsMissing: 'Folgende Dokumente fehlen: {documents}',
    verificationPending: 'Ihre Dokumente werden noch überprüft',
    verificationFailed: 'Die Überprüfung Ihrer Dokumente ist fehlgeschlagen',
    approvalPending: 'Ihre Kreditanfrage wird noch bearbeitet',
    alreadyApproved: 'Diese Kreditanfrage wurde bereits genehmigt',
    alreadyRejected: 'Diese Kreditanfrage wurde bereits abgelehnt',
    noOffersAvailable: 'Derzeit sind keine Angebote verfügbar',
    offerExpired: 'Dieses Angebot ist abgelaufen',
    offerNotAvailable: 'Dieses Angebot ist nicht mehr verfügbar'
  },

  // Document Errors
  document: {
    uploadFailed: 'Dokument-Upload fehlgeschlagen',
    downloadFailed: 'Dokument-Download fehlgeschlagen',
    deleteFailed: 'Dokument konnte nicht gelöscht werden',
    notFound: 'Dokument nicht gefunden',
    invalidType: 'Ungültiger Dokumenttyp',
    tooLarge: 'Dokument zu groß (Maximum: {size}MB)',
    invalidFormat: 'Ungültiges Dokumentformat. Erlaubt: {formats}',
    alreadyExists: 'Ein Dokument mit diesem Namen existiert bereits',
    required: 'Dieses Dokument ist erforderlich',
    expired: 'Dieses Dokument ist abgelaufen',
    rejected: 'Dieses Dokument wurde abgelehnt',
    unreadable: 'Dokument ist nicht lesbar',
    corrupted: 'Dokument ist beschädigt',
    virusDetected: 'Virus im Dokument erkannt',
    processingFailed: 'Dokumentverarbeitung fehlgeschlagen',
    conversionFailed: 'Dokumentkonvertierung fehlgeschlagen'
  },

  // Partner Errors
  partner: {
    notFound: 'Partner nicht gefunden',
    inactive: 'Dieser Partner ist derzeit nicht aktiv',
    noOffersAvailable: 'Dieser Partner hat derzeit keine Angebote',
    connectionFailed: 'Verbindung zum Partner fehlgeschlagen',
    apiError: 'Fehler bei der Partner-API',
    timeout: 'Zeitüberschreitung bei der Partner-Anfrage',
    invalidResponse: 'Ungültige Antwort vom Partner',
    serviceUnavailable: 'Partner-Service nicht verfügbar'
  },

  // Credit Score Errors
  creditScore: {
    notFound: 'Bonitätsscore nicht gefunden',
    calculationFailed: 'Berechnung des Bonitätsscores fehlgeschlagen',
    insufficientData: 'Nicht genügend Daten für Bonitätsbewertung',
    updateFailed: 'Aktualisierung des Bonitätsscores fehlgeschlagen',
    tooLow: 'Ihr Bonitätsscore ist zu niedrig für diesen Kredit',
    expired: 'Ihr Bonitätsscore ist veraltet. Bitte aktualisieren Sie ihn',
    verificationRequired: 'Bonitätsprüfung erforderlich'
  },

  // Notification Errors
  notification: {
    sendFailed: 'Benachrichtigung konnte nicht gesendet werden',
    notFound: 'Benachrichtigung nicht gefunden',
    alreadyRead: 'Benachrichtigung wurde bereits gelesen',
    deleteFailed: 'Benachrichtigung konnte nicht gelöscht werden',
    invalidType: 'Ungültiger Benachrichtigungstyp',
    tooMany: 'Zu viele Benachrichtigungen. Bitte löschen Sie einige'
  },

  // Contact Errors
  contact: {
    sendFailed: 'Nachricht konnte nicht gesendet werden',
    invalidSubject: 'Ungültiger Betreff',
    messageTooShort: 'Nachricht zu kurz (mindestens {min} Zeichen)',
    messageTooLong: 'Nachricht zu lang (maximal {max} Zeichen)',
    spamDetected: 'Spam erkannt. Bitte versuchen Sie es später erneut',
    rateLimitExceeded: 'Zu viele Nachrichten. Bitte warten Sie {minutes} Minuten'
  },

  // Appointment Errors
  appointment: {
    notFound: 'Termin nicht gefunden',
    notAvailable: 'Dieser Termin ist nicht mehr verfügbar',
    alreadyBooked: 'Dieser Termin ist bereits gebucht',
    tooSoon: 'Termin kann nicht so kurzfristig gebucht werden',
    tooLate: 'Termin liegt zu weit in der Zukunft',
    pastDate: 'Termin liegt in der Vergangenheit',
    outsideBusinessHours: 'Termin außerhalb der Geschäftszeiten',
    conflictingAppointment: 'Sie haben bereits einen Termin zu dieser Zeit',
    cancellationTooLate: 'Termin kann nicht mehr storniert werden (weniger als 24h)',
    rescheduleFailed: 'Termin konnte nicht verschoben werden',
    confirmationFailed: 'Terminbestätigung fehlgeschlagen',
    reminderFailed: 'Terminerinnerung konnte nicht gesendet werden',
    maxAppointmentsReached: 'Maximale Anzahl an Terminen erreicht'
  },

  // Review Errors
  review: {
    notFound: 'Bewertung nicht gefunden',
    alreadyReviewed: 'Sie haben bereits eine Bewertung abgegeben',
    notEligible: 'Sie sind nicht berechtigt, eine Bewertung abzugeben',
    ratingRequired: 'Bewertung ist erforderlich',
    ratingInvalid: 'Ungültige Bewertung (1-5 Sterne)',
    commentTooShort: 'Kommentar zu kurz (mindestens {min} Zeichen)',
    commentTooLong: 'Kommentar zu lang (maximal {max} Zeichen)',
    inappropriate: 'Unangemessener Inhalt erkannt',
    spamDetected: 'Spam erkannt',
    updateFailed: 'Bewertung konnte nicht aktualisiert werden',
    deleteFailed: 'Bewertung konnte nicht gelöscht werden'
  },

  // FAQ Errors
  faq: {
    notFound: 'FAQ nicht gefunden',
    categoryNotFound: 'FAQ-Kategorie nicht gefunden',
    searchFailed: 'FAQ-Suche fehlgeschlagen',
    noResults: 'Keine Ergebnisse gefunden'
  },

  // File Upload Errors
  upload: {
    failed: 'Upload fehlgeschlagen',
    noFile: 'Keine Datei ausgewählt',
    tooLarge: 'Datei zu groß (Maximum: {size}MB)',
    tooMany: 'Zu viele Dateien (Maximum: {max})',
    invalidType: 'Ungültiger Dateityp. Erlaubt: {types}',
    invalidName: 'Ungültiger Dateiname',
    alreadyExists: 'Datei existiert bereits',
    virusDetected: 'Virus erkannt',
    corrupted: 'Datei ist beschädigt',
    processingFailed: 'Dateiverarbeitung fehlgeschlagen',
    storageFull: 'Speicherplatz voll',
    quotaExceeded: 'Speicherkontingent überschritten'
  },

  // Database Errors
  database: {
    connectionFailed: 'Datenbankverbindung fehlgeschlagen',
    queryFailed: 'Datenbankabfrage fehlgeschlagen',
    transactionFailed: 'Datenbanktransaktion fehlgeschlagen',
    duplicateEntry: 'Eintrag existiert bereits',
    foreignKeyViolation: 'Referenzfehler',
    constraintViolation: 'Einschränkungsverletzung',
    deadlock: 'Datenbank-Deadlock',
    timeout: 'Datenbank-Zeitüberschreitung'
  },

  // Server Errors
  server: {
    internalError: 'Interner Serverfehler',
    serviceUnavailable: 'Service vorübergehend nicht verfügbar',
    maintenance: 'Wartungsarbeiten. Bitte versuchen Sie es später erneut',
    timeout: 'Anfrage-Zeitüberschreitung',
    tooManyRequests: 'Zu viele Anfragen. Bitte verlangsamen Sie',
    badGateway: 'Gateway-Fehler',
    networkError: 'Netzwerkfehler',
    connectionLost: 'Verbindung verloren',
    apiError: 'API-Fehler',
    externalServiceError: 'Externer Service-Fehler'
  },

  // Payment Errors (für zukünftige Implementierung)
  payment: {
    failed: 'Zahlung fehlgeschlagen',
    declined: 'Zahlung abgelehnt',
    insufficientFunds: 'Unzureichende Deckung',
    invalidCard: 'Ungültige Karte',
    cardExpired: 'Karte abgelaufen',
    invalidCvv: 'Ungültiger CVV-Code',
    processingError: 'Zahlungsverarbeitungsfehler',
    timeout: 'Zahlungs-Zeitüberschreitung',
    cancelled: 'Zahlung storniert',
    refundFailed: 'Rückerstattung fehlgeschlagen'
  },

  // General Errors
  general: {
    notFound: 'Nicht gefunden',
    badRequest: 'Ungültige Anfrage',
    unauthorized: 'Nicht autorisiert',
    forbidden: 'Zugriff verweigert',
    conflict: 'Konflikt',
    gone: 'Nicht mehr verfügbar',
    unprocessable: 'Anfrage kann nicht verarbeitet werden',
    tooManyRequests: 'Zu viele Anfragen',
    internalError: 'Interner Fehler',
    notImplemented: 'Nicht implementiert',
    serviceUnavailable: 'Service nicht verfügbar',
    unknown: 'Unbekannter Fehler',
    tryAgain: 'Bitte versuchen Sie es erneut',
    contactSupport: 'Bitte kontaktieren Sie den Support'
  }
};

/**
 * Get error message with parameter replacement
 * @param {string} category - Error category (e.g., 'auth', 'loan')
 * @param {string} key - Error key
 * @param {object} params - Parameters to replace in message
 * @returns {string} Error message
 */
const getErrorMessage = (category, key, params = {}) => {
  try {
    let message = errorMessages[category]?.[key] || errorMessages.general.unknown;
    
    // Replace parameters in message
    Object.keys(params).forEach(param => {
      message = message.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });
    
    return message;
  } catch (error) {
    return errorMessages.general.unknown;
  }
};

/**
 * Create error response object
 * @param {string} category - Error category
 * @param {string} key - Error key
 * @param {object} params - Parameters
 * @param {number} statusCode - HTTP status code
 * @returns {object} Error response
 */
const createErrorResponse = (category, key, params = {}, statusCode = 400) => {
  return {
    success: false,
    error: {
      message: getErrorMessage(category, key, params),
      code: `${category.toUpperCase()}_${key.toUpperCase()}`,
      category,
      key,
      statusCode
    }
  };
};

module.exports = {
  errorMessages,
  getErrorMessage,
  createErrorResponse
};

// Made with Bob
