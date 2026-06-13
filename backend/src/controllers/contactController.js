const Contact = require('../models/Contact');

// Get opening hours
exports.getOpeningHours = async (req, res) => {
  try {
    const hours = await Contact.getOpeningHours();
    const isOpen = await Contact.isCurrentlyOpen();

    res.json({
      hours,
      is_currently_open: isOpen
    });
  } catch (error) {
    console.error('Error fetching opening hours:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Öffnungszeiten' });
  }
};

// Get opening hours for specific day
exports.getOpeningHoursByDay = async (req, res) => {
  try {
    const { day } = req.params;
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (!validDays.includes(day.toLowerCase())) {
      return res.status(400).json({ message: 'Ungültiger Wochentag' });
    }

    const hours = await Contact.getOpeningHoursByDay(day.toLowerCase());
    
    if (!hours) {
      return res.status(404).json({ message: 'Öffnungszeiten nicht gefunden' });
    }

    res.json(hours);
  } catch (error) {
    console.error('Error fetching opening hours by day:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Öffnungszeiten' });
  }
};

// Update opening hours (admin only)
exports.updateOpeningHours = async (req, res) => {
  try {
    const { day } = req.params;
    const { open_time, close_time, is_closed } = req.body;

    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    if (!validDays.includes(day.toLowerCase())) {
      return res.status(400).json({ message: 'Ungültiger Wochentag' });
    }

    const hours = await Contact.updateOpeningHours(day.toLowerCase(), {
      open_time,
      close_time,
      is_closed
    });

    res.json({
      message: 'Öffnungszeiten erfolgreich aktualisiert',
      hours
    });
  } catch (error) {
    console.error('Error updating opening hours:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren der Öffnungszeiten' });
  }
};

// Check if currently open
exports.checkIfOpen = async (req, res) => {
  try {
    const isOpen = await Contact.isCurrentlyOpen();
    res.json({ is_open: isOpen });
  } catch (error) {
    console.error('Error checking if open:', error);
    res.status(500).json({ message: 'Fehler bei der Statusprüfung' });
  }
};

// Create contact message
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const userId = req.user ? req.user.id : null;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Name, E-Mail, Betreff und Nachricht sind erforderlich' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Ungültige E-Mail-Adresse' });
    }

    if (message.length < 10) {
      return res.status(400).json({ 
        message: 'Die Nachricht muss mindestens 10 Zeichen lang sein' 
      });
    }

    const messageData = {
      name,
      email,
      phone: phone || null,
      subject,
      message,
      user_id: userId
    };

    const contactMessage = await Contact.createContactMessage(messageData);

    res.status(201).json({
      message: 'Ihre Nachricht wurde erfolgreich gesendet. Wir werden uns in Kürze bei Ihnen melden.',
      contact_message: contactMessage
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ message: 'Fehler beim Senden der Nachricht' });
  }
};

// Get all contact messages (admin)
exports.getAllMessages = async (req, res) => {
  try {
    const { status, user_id } = req.query;
    const filters = {};
    
    if (status) filters.status = status;
    if (user_id) filters.user_id = user_id;

    const messages = await Contact.getAllMessages(filters);
    const pendingCount = await Contact.getPendingCount();

    res.json({
      messages,
      pending_count: pendingCount
    });
  } catch (error) {
    console.error('Error fetching all messages:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Nachrichten' });
  }
};

// Get message by ID (admin)
exports.getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.getMessageById(id);

    if (!message) {
      return res.status(404).json({ message: 'Nachricht nicht gefunden' });
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: 'Fehler beim Laden der Nachricht' });
  }
};

// Update message status (admin)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status ist erforderlich' });
    }

    const validStatuses = ['pending', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Ungültiger Status' });
    }

    const message = await Contact.updateMessageStatus(id, status, admin_notes);

    if (!message) {
      return res.status(404).json({ message: 'Nachricht nicht gefunden' });
    }

    res.json({
      message: 'Status erfolgreich aktualisiert',
      contact_message: message
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Status' });
  }
};

// Delete message (admin)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.deleteMessage(id);

    if (!message) {
      return res.status(404).json({ message: 'Nachricht nicht gefunden' });
    }

    res.json({ message: 'Nachricht erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Fehler beim Löschen der Nachricht' });
  }
};

// Get user's own messages
exports.getUserMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Contact.getUserMessages(userId);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: 'Fehler beim Laden Ihrer Nachrichten' });
  }
};

// Initialize opening hours (setup endpoint)
exports.initializeOpeningHours = async (req, res) => {
  try {
    await Contact.initializeOpeningHours();
    res.json({ message: 'Öffnungszeiten erfolgreich initialisiert' });
  } catch (error) {
    console.error('Error initializing opening hours:', error);
    res.status(500).json({ message: 'Fehler bei der Initialisierung' });
  }
};

module.exports = exports;

// Made with Bob
