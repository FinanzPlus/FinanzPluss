const Notification = require('../models/Notification');

/**
 * Contrôleur Notification
 */
class NotificationController {
  /**
   * Récupérer toutes les notifications de l'utilisateur connecté
   */
  static async getMyNotifications(req, res) {
    try {
      const filters = {
        type: req.query.type,
        is_read: req.query.is_read !== undefined ? req.query.is_read === 'true' : undefined,
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const notifications = await Notification.findByUserId(req.user.id, filters);

      res.json({
        success: true,
        data: notifications,
        count: notifications.length,
        pagination: {
          limit: filters.limit,
          offset: filters.offset
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des notifications'
      });
    }
  }

  /**
   * Récupérer les notifications non lues de l'utilisateur
   */
  static async getUnreadNotifications(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const notifications = await Notification.findUnreadByUserId(req.user.id, limit);

      res.json({
        success: true,
        data: notifications,
        count: notifications.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications non lues:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des notifications'
      });
    }
  }

  /**
   * Compter les notifications non lues
   */
  static async getUnreadCount(req, res) {
    try {
      const count = await Notification.countUnreadByUserId(req.user.id);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      console.error('Erreur lors du comptage des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du comptage des notifications'
      });
    }
  }

  /**
   * Récupérer une notification par ID
   */
  static async getById(req, res) {
    try {
      const notification = await Notification.findById(req.params.id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification non trouvée'
        });
      }

      // Vérifier que l'utilisateur a le droit d'accéder à cette notification
      if (req.user.role !== 'admin' && notification.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
      }

      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la notification:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de la notification'
      });
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markAsRead(req, res) {
    try {
      const notification = await Notification.findById(req.params.id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification non trouvée'
        });
      }

      // Vérifier que l'utilisateur a le droit de modifier cette notification
      if (req.user.role !== 'admin' && notification.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
      }

      const updatedNotification = await Notification.markAsRead(req.params.id);

      res.json({
        success: true,
        data: updatedNotification,
        message: 'Notification marquée comme lue'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour de la notification'
      });
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  static async markAllAsRead(req, res) {
    try {
      const notifications = await Notification.markAllAsRead(req.user.id);

      res.json({
        success: true,
        data: notifications,
        count: notifications.length,
        message: 'Toutes les notifications ont été marquées comme lues'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour des notifications'
      });
    }
  }

  /**
   * Marquer plusieurs notifications comme lues
   */
  static async markMultipleAsRead(req, res) {
    try {
      const { notification_ids } = req.body;

      if (!Array.isArray(notification_ids) || notification_ids.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'IDs de notifications invalides'
        });
      }

      const notifications = await Notification.markMultipleAsRead(
        notification_ids,
        req.user.id
      );

      res.json({
        success: true,
        data: notifications,
        count: notifications.length,
        message: 'Notifications marquées comme lues'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour des notifications'
      });
    }
  }

  /**
   * Supprimer une notification
   */
  static async deleteNotification(req, res) {
    try {
      const notification = await Notification.findById(req.params.id);

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification non trouvée'
        });
      }

      // Vérifier que l'utilisateur a le droit de supprimer cette notification
      if (req.user.role !== 'admin' && notification.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
      }

      await Notification.delete(req.params.id);

      res.json({
        success: true,
        message: 'Notification supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de la notification'
      });
    }
  }

  /**
   * Supprimer toutes les notifications de l'utilisateur
   */
  static async deleteAllNotifications(req, res) {
    try {
      const notifications = await Notification.deleteAllByUserId(req.user.id);

      res.json({
        success: true,
        count: notifications.length,
        message: 'Toutes les notifications ont été supprimées'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression des notifications'
      });
    }
  }

  /**
   * Récupérer les statistiques des notifications de l'utilisateur
   */
  static async getMyStats(req, res) {
    try {
      const stats = await Notification.getStatsByUserId(req.user.id);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  // ============================================================================
  // ROUTES ADMIN
  // ============================================================================

  /**
   * Récupérer toutes les notifications (admin)
   */
  static async getAllNotifications(req, res) {
    try {
      const filters = {
        user_id: req.query.user_id,
        type: req.query.type,
        is_read: req.query.is_read !== undefined ? req.query.is_read === 'true' : undefined,
        sortBy: req.query.sortBy || 'created_at',
        order: req.query.order || 'DESC',
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
      };

      const notifications = await Notification.findAll(filters);

      res.json({
        success: true,
        data: notifications,
        count: notifications.length,
        pagination: {
          limit: filters.limit,
          offset: filters.offset
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des notifications'
      });
    }
  }

  /**
   * Créer une notification (admin)
   */
  static async createNotification(req, res) {
    try {
      const {
        user_id,
        type,
        title,
        message,
        related_entity_type,
        related_entity_id,
        action_url
      } = req.body;

      const notificationData = {
        user_id,
        type,
        title,
        message,
        related_entity_type,
        related_entity_id,
        action_url
      };

      const notification = await Notification.create(notificationData);

      res.status(201).json({
        success: true,
        data: notification,
        message: 'Notification créée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création de la notification'
      });
    }
  }

  /**
   * Envoyer une notification à tous les utilisateurs (broadcast)
   */
  static async broadcastNotification(req, res) {
    try {
      const { type, title, message, action_url } = req.body;

      const notificationData = {
        type,
        title,
        message,
        action_url
      };

      const notifications = await Notification.broadcast(notificationData);

      res.status(201).json({
        success: true,
        data: notifications,
        count: notifications.length,
        message: `Notification envoyée à ${notifications.length} utilisateurs`
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'envoi de la notification'
      });
    }
  }

  /**
   * Récupérer les statistiques globales des notifications (admin)
   */
  static async getStats(req, res) {
    try {
      const stats = await Notification.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      });
    }
  }

  /**
   * Supprimer les anciennes notifications lues (admin)
   */
  static async deleteOldRead(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const notifications = await Notification.deleteOldRead(days);

      res.json({
        success: true,
        count: notifications.length,
        message: `${notifications.length} notifications supprimées`
      });
    } catch (error) {
      console.error('Erreur lors de la suppression des notifications:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression des notifications'
      });
    }
  }
}

module.exports = NotificationController;

// Made with Bob
