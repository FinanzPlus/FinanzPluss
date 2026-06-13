const FAQ = require('../models/FAQ');

/**
 * Contrôleur FAQ
 */
class FAQController {
  /**
   * Récupérer toutes les FAQs (publiques)
   */
  static async getAll(req, res) {
    try {
      const filters = {
        category: req.query.category,
        is_active: true, // Seulement les FAQs actives pour le public
        sortBy: req.query.sortBy || 'display_order',
        order: req.query.order || 'ASC'
      };

      const faqs = await FAQ.findAll(filters);

      res.json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des FAQs:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des FAQs'
      });
    }
  }

  /**
   * Récupérer une FAQ par ID
   */
  static async getById(req, res) {
    try {
      const faq = await FAQ.findById(req.params.id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          error: 'FAQ non trouvée'
        });
      }

      // Incrémenter le compteur de vues
      await FAQ.incrementViewCount(req.params.id);

      res.json({
        success: true,
        data: faq
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la FAQ:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de la FAQ'
      });
    }
  }

  /**
   * Récupérer les FAQs par catégorie
   */
  static async getByCategory(req, res) {
    try {
      const faqs = await FAQ.findByCategory(req.params.category);

      res.json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des FAQs par catégorie:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des FAQs'
      });
    }
  }

  /**
   * Récupérer toutes les catégories
   */
  static async getCategories(req, res) {
    try {
      const categories = await FAQ.getCategories();

      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des catégories'
      });
    }
  }

  /**
   * Rechercher dans les FAQs
   */
  static async search(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Le terme de recherche doit contenir au moins 2 caractères'
        });
      }

      const faqs = await FAQ.search(q.trim());

      res.json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error) {
      console.error('Erreur lors de la recherche de FAQs:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la recherche'
      });
    }
  }

  /**
   * Récupérer les FAQs les plus consultées
   */
  static async getMostViewed(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const faqs = await FAQ.getMostViewed(limit);

      res.json({
        success: true,
        data: faqs,
        count: faqs.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des FAQs populaires:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des FAQs populaires'
      });
    }
  }

  // ============================================================================
  // ROUTES ADMIN
  // ============================================================================

  /**
   * Récupérer toutes les FAQs (admin - inclut les inactives)
   */
  static async getAllAdmin(req, res) {
    try {
      const filters = {
        category: req.query.category,
        is_active: req.query.is_active !== undefined ? req.query.is_active === 'true' : undefined,
        sortBy: req.query.sortBy || 'display_order',
        order: req.query.order || 'ASC',
        limit: parseInt(req.query.limit) || 100,
        offset: parseInt(req.query.offset) || 0
      };

      const faqs = await FAQ.findAll(filters);

      res.json({
        success: true,
        data: faqs,
        count: faqs.length,
        pagination: {
          limit: filters.limit,
          offset: filters.offset
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des FAQs:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des FAQs'
      });
    }
  }

  /**
   * Créer une nouvelle FAQ (admin)
   */
  static async create(req, res) {
    try {
      const { question_de, answer_de, category, display_order } = req.body;

      const faqData = {
        question_de,
        answer_de,
        category,
        display_order
      };

      const faq = await FAQ.create(faqData);

      res.status(201).json({
        success: true,
        data: faq,
        message: 'FAQ créée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la création de la FAQ:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création de la FAQ'
      });
    }
  }

  /**
   * Mettre à jour une FAQ (admin)
   */
  static async update(req, res) {
    try {
      const updates = {
        question_de: req.body.question_de,
        answer_de: req.body.answer_de,
        category: req.body.category,
        display_order: req.body.display_order,
        is_active: req.body.is_active
      };

      const faq = await FAQ.update(req.params.id, updates);

      if (!faq) {
        return res.status(404).json({
          success: false,
          error: 'FAQ non trouvée'
        });
      }

      res.json({
        success: true,
        data: faq,
        message: 'FAQ mise à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la FAQ:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour de la FAQ'
      });
    }
  }

  /**
   * Supprimer une FAQ (admin)
   */
  static async delete(req, res) {
    try {
      const faq = await FAQ.delete(req.params.id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          error: 'FAQ non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'FAQ supprimée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la FAQ:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression de la FAQ'
      });
    }
  }

  /**
   * Activer/Désactiver une FAQ (admin)
   */
  static async toggleActive(req, res) {
    try {
      const faq = await FAQ.toggleActive(req.params.id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          error: 'FAQ non trouvée'
        });
      }

      res.json({
        success: true,
        data: faq,
        message: `FAQ ${faq.is_active ? 'activée' : 'désactivée'} avec succès`
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut de la FAQ:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du changement de statut'
      });
    }
  }

  /**
   * Dupliquer une FAQ (admin)
   */
  static async duplicate(req, res) {
    try {
      const faq = await FAQ.duplicate(req.params.id);

      res.status(201).json({
        success: true,
        data: faq,
        message: 'FAQ dupliquée avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la duplication de la FAQ:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Erreur lors de la duplication de la FAQ'
      });
    }
  }

  /**
   * Réorganiser les FAQs (admin)
   */
  static async reorder(req, res) {
    try {
      const { faq_orders } = req.body;

      if (!Array.isArray(faq_orders) || faq_orders.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Format de données invalide'
        });
      }

      await FAQ.reorder(faq_orders);

      res.json({
        success: true,
        message: 'Ordre des FAQs mis à jour avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation des FAQs:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la réorganisation des FAQs'
      });
    }
  }

  /**
   * Récupérer les statistiques des FAQs (admin)
   */
  static async getStats(req, res) {
    try {
      const stats = await FAQ.getStats();

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
}

module.exports = FAQController;

// Made with Bob
