// Configuration de l'API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// WhatsApp
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+447451267912';
export const WHATSAPP_BASE_URL = 'https://wa.me';

// Taux d'intérêt fixe FinanzPlus Austria
export const FIXED_INTEREST_RATE = 2.8;

// Devise
export const CURRENCY = import.meta.env.VITE_CURRENCY || 'EUR';
export const CURRENCY_SYMBOL = import.meta.env.VITE_CURRENCY_SYMBOL || '€';

// Pagination
export const ITEMS_PER_PAGE = parseInt(import.meta.env.VITE_ITEMS_PER_PAGE) || 12;

// Informations de contact
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@finanzplus-austria.com';
export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+49 155 652367949';
export const CONTACT_ADDRESS = import.meta.env.VITE_CONTACT_ADDRESS || 'Musterstraße 123, 1010 Wien, Österreich';

// Catégories de produits
export const PRODUCT_CATEGORIES = {
  CAR: 'car',
  FURNITURE: 'furniture'
};

// Statuts de produits
export const PRODUCT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SOLD: 'sold',
  RESERVED: 'reserved'
};

// Statuts de commandes
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Statuts de paiement
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Méthodes de paiement
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  FINANCING: 'financing',
  CASH: 'cash'
};

// Rôles utilisateurs
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Types de carburant (en allemand)
export const FUEL_TYPES = [
  { value: 'Benzin', label: 'Benzin' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Elektro', label: 'Elektro' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Gas', label: 'Gas' }
];

// Types de transmission (en allemand)
export const TRANSMISSION_TYPES = [
  { value: 'Manuell', label: 'Manuell' },
  { value: 'Automatik', label: 'Automatik' }
];

// Jours de la semaine (en allemand)
export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sonntag' },
  { value: 1, label: 'Montag' },
  { value: 2, label: 'Dienstag' },
  { value: 3, label: 'Mittwoch' },
  { value: 4, label: 'Donnerstag' },
  { value: 5, label: 'Freitag' },
  { value: 6, label: 'Samstag' }
];

// Options de tri
export const SORT_OPTIONS = [
  { value: 'created_at-DESC', label: 'Neueste zuerst' },
  { value: 'created_at-ASC', label: 'Älteste zuerst' },
  { value: 'price-ASC', label: 'Preis aufsteigend' },
  { value: 'price-DESC', label: 'Preis absteigend' },
  { value: 'title-ASC', label: 'Name A-Z' },
  { value: 'title-DESC', label: 'Name Z-A' }
];

// Durées de prêt (en mois)
export const LOAN_DURATIONS = [
  { value: 12, label: '12 Monate' },
  { value: 24, label: '24 Monate' },
  { value: 36, label: '36 Monate' },
  { value: 48, label: '48 Monate' },
  { value: 60, label: '60 Monate' },
  { value: 72, label: '72 Monate' },
  { value: 84, label: '84 Monate' }
];

// Messages d'erreur (en allemand)
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.',
  SERVER_ERROR: 'Serverfehler. Bitte versuchen Sie es später erneut.',
  UNAUTHORIZED: 'Sie müssen angemeldet sein, um fortzufahren.',
  FORBIDDEN: 'Sie haben keine Berechtigung für diese Aktion.',
  NOT_FOUND: 'Die angeforderte Ressource wurde nicht gefunden.',
  VALIDATION_ERROR: 'Bitte überprüfen Sie Ihre Eingaben.',
  UNKNOWN_ERROR: 'Ein unbekannter Fehler ist aufgetreten.'
};

// Messages de succès (en allemand)
export const SUCCESS_MESSAGES = {
  LOGIN: 'Erfolgreich angemeldet!',
  REGISTER: 'Registrierung erfolgreich!',
  LOGOUT: 'Erfolgreich abgemeldet!',
  PROFILE_UPDATED: 'Profil erfolgreich aktualisiert!',
  PASSWORD_CHANGED: 'Passwort erfolgreich geändert!',
  ITEM_ADDED_TO_CART: 'Artikel zum Warenkorb hinzugefügt!',
  ITEM_REMOVED_FROM_CART: 'Artikel aus dem Warenkorb entfernt!',
  ORDER_PLACED: 'Bestellung erfolgreich aufgegeben!',
  COMMENT_ADDED: 'Kommentar erfolgreich hinzugefügt!',
  MESSAGE_SENT: 'Nachricht erfolgreich gesendet!'
};

// Regex pour validation
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\+\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  POSTAL_CODE: /^\d{4,5}$/
};

// Limites
export const LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_COMMENT_LENGTH: 500,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_LOAN_AMOUNT: 1000,
  MAX_LOAN_AMOUNT: 100000,
  MIN_LOAN_DURATION: 12,
  MAX_LOAN_DURATION: 84
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/anmelden',
  REGISTER: '/registrieren',
  CARS: '/autos',
  FURNITURE: '/mobel',
  FINANCIAL: '/finanzierung',
  PRODUCT_DETAIL: '/produkt/:slug',
  CART: '/warenkorb',
  CHECKOUT: '/kasse',
  PROFILE: '/profil',
  ORDERS: '/bestellungen',
  FAVORITES: '/favoriten',
  COMMENTS: '/bewertungen',
  CONTACT: '/kontakt',
  ADMIN: '/admin',
  NOT_FOUND: '*'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'finanzplus_auth_token',
  REFRESH_TOKEN: 'finanzplus_refresh_token',
  USER_DATA: 'finanzplus_user_data',
  CART_ITEMS: 'finanzplus_cart_items',
  THEME: 'finanzplus_theme'
};

// Made with Bob

// Textes de l'interface (en allemand)
export const TEXTS = {
  // Navigation
  NAV_HOME: 'Startseite',
  NAV_CARS: 'Autos',
  NAV_FURNITURE: 'Möbel',
  NAV_FINANCIAL: 'Finanzierung',
  NAV_CONTACT: 'Kontakt',
  NAV_LOGIN: 'Anmelden',
  NAV_REGISTER: 'Registrieren',
  NAV_LOGOUT: 'Abmelden',
  NAV_PROFILE: 'Profil',
  NAV_CART: 'Warenkorb',
  NAV_ADMIN: 'Admin Dashboard',
  
  // Boutons
  BTN_SUBMIT: 'Absenden',
  BTN_CANCEL: 'Abbrechen',
  BTN_SAVE: 'Speichern',
  BTN_DELETE: 'Löschen',
  BTN_EDIT: 'Bearbeiten',
  BTN_ADD: 'Hinzufügen',
  BTN_SEARCH: 'Suchen',
  BTN_FILTER: 'Filtern',
  BTN_RESET: 'Zurücksetzen',
  BTN_LOAD_MORE: 'Mehr laden',
  BTN_ADD_TO_CART: 'In den Warenkorb',
  BTN_BUY_NOW: 'Jetzt kaufen',
  BTN_CALCULATE: 'Berechnen',
  BTN_REQUEST_FINANCING: 'Finanzierung anfragen',
  BTN_SEND_MESSAGE: 'Nachricht senden',
  BTN_VIEW_DETAILS: 'Details ansehen',
  
  // Formulaires
  FORM_EMAIL: 'E-Mail',
  FORM_PASSWORD: 'Passwort',
  FORM_CONFIRM_PASSWORD: 'Passwort bestätigen',
  FORM_NAME: 'Name',
  FORM_FIRST_NAME: 'Vorname',
  FORM_LAST_NAME: 'Nachname',
  FORM_PHONE: 'Telefon',
  FORM_ADDRESS: 'Adresse',
  FORM_CITY: 'Stadt',
  FORM_POSTAL_CODE: 'Postleitzahl',
  FORM_MESSAGE: 'Nachricht',
  FORM_COMMENT: 'Kommentar',
  FORM_RATING: 'Bewertung',
  
  // Produits
  PRODUCT_PRICE: 'Preis',
  PRODUCT_DESCRIPTION: 'Beschreibung',
  PRODUCT_FEATURES: 'Eigenschaften',
  PRODUCT_SPECIFICATIONS: 'Spezifikationen',
  PRODUCT_AVAILABILITY: 'Verfügbarkeit',
  PRODUCT_CONDITION: 'Zustand',
  PRODUCT_BRAND: 'Marke',
  PRODUCT_MODEL: 'Modell',
  PRODUCT_YEAR: 'Jahr',
  PRODUCT_MILEAGE: 'Kilometerstand',
  PRODUCT_FUEL_TYPE: 'Kraftstoffart',
  PRODUCT_TRANSMISSION: 'Getriebe',
  PRODUCT_COLOR: 'Farbe',
  PRODUCT_MATERIAL: 'Material',
  PRODUCT_DIMENSIONS: 'Abmessungen',
  PRODUCT_WEIGHT: 'Gewicht',
  
  // Panier
  CART_TITLE: 'Warenkorb',
  CART_EMPTY: 'Ihr Warenkorb ist leer',
  CART_TOTAL: 'Gesamt',
  CART_SUBTOTAL: 'Zwischensumme',
  CART_QUANTITY: 'Menge',
  CART_REMOVE: 'Entfernen',
  
  // Financement
  LOAN_AMOUNT: 'Kreditbetrag',
  LOAN_DURATION: 'Laufzeit',
  LOAN_MONTHLY_PAYMENT: 'Monatliche Rate',
  LOAN_TOTAL_AMOUNT: 'Gesamtbetrag',
  LOAN_INTEREST_RATE: 'Zinssatz',
  LOAN_TOTAL_INTEREST: 'Gesamtzinsen',
  
  // Commentaires
  COMMENT_ADD: 'Bewertung hinzufügen',
  COMMENT_YOUR_RATING: 'Ihre Bewertung',
  COMMENT_YOUR_COMMENT: 'Ihr Kommentar',
  COMMENT_SUBMIT: 'Bewertung absenden',
  COMMENT_PENDING: 'Ausstehend',
  COMMENT_APPROVED: 'Genehmigt',
  COMMENT_REJECTED: 'Abgelehnt',
  
  // Contact
  CONTACT_TITLE: 'Kontakt',
  CONTACT_OPENING_HOURS: 'Öffnungszeiten',
  CONTACT_ADDRESS: 'Adresse',
  CONTACT_PHONE: 'Telefon',
  CONTACT_EMAIL: 'E-Mail',
  CONTACT_SEND_MESSAGE: 'Nachricht senden',
  CONTACT_OPEN: 'Geöffnet',
  CONTACT_CLOSED: 'Geschlossen',
  
  // Messages
  MSG_LOADING: 'Laden...',
  MSG_NO_RESULTS: 'Keine Ergebnisse gefunden',
  MSG_ERROR: 'Ein Fehler ist aufgetreten',
  MSG_SUCCESS: 'Erfolgreich',
  MSG_CONFIRM_DELETE: 'Möchten Sie dieses Element wirklich löschen?',
  
  // Pagination
  PAGINATION_PREVIOUS: 'Zurück',
  PAGINATION_NEXT: 'Weiter',
  PAGINATION_PAGE: 'Seite',
  PAGINATION_OF: 'von',
  
  // Filtres
  FILTER_ALL: 'Alle',
  FILTER_SORT_BY: 'Sortieren nach',
  FILTER_PRICE_RANGE: 'Preisspanne',
  FILTER_MIN_PRICE: 'Min. Preis',
  FILTER_MAX_PRICE: 'Max. Preis',
  FILTER_APPLY: 'Anwenden',
  FILTER_CLEAR: 'Löschen'
};
