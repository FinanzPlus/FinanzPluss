const Partner = require('../models/Partner');

class PartnerController {
  // Récupérer tous les partenaires (public)
  static async getAll(req, res) {
    try {
      const { active, sortBy, order } = req.query;

      const filters = {
        active: active === 'true' ? true : active === 'false' ? false : undefined,
        sortBy: sortBy || 'display_order',
        order: order || 'ASC'
      };

      const partners = await Partner.findAll(filters);

      res.json({
        success: true,
        data: partners
      });
    } catch (error) {
      console.error('Erreur récupération partenaires:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des partenaires'
      });
    }
  }

  // Récupérer un partenaire par ID (public)
  static async getById(req, res) {
    try {
      const { id } = req.params;

      const partner = await Partner.findById(id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partenaire non trouvé'
        });
      }

      res.json({
        success: true,
        data: partner
      });
    } catch (error) {
      console.error('Erreur récupération partenaire:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du partenaire'
      });
    }
  }

  // Récupérer les partenaires actifs pour comparaison (public)
  static async getActiveForComparison(req, res) {
    try {
      const { amount, duration } = req.query;

      if (!amount || !duration) {
        return res.status(400).json({
          success: false,
          error: 'Montant et durée requis'
        });
      }

      const partners = await Partner.findActiveForComparison(
        parseFloat(amount),
        parseInt(duration)
      );

      res.json({
        success: true,
        data: partners
      });
    } catch (error) {
      console.error('Erreur récupération partenaires comparaison:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des partenaires'
      });
    }
  }

  // Créer un partenaire (admin)
  static async create(req, res) {
    try {
      const {
        name,
        logo_url,
        description,
        official_website,
        interest_rate_min,
        interest_rate_max,
        min_loan_amount,
        max_loan_amount,
        min_duration_months,
        max_duration_months,
        certifications,
        is_active,
        display_order
      } = req.body;

      // Validation
      if (!name || !interest_rate_min || !interest_rate_max || 
          !min_loan_amount || !max_loan_amount ||
          !min_duration_months || !max_duration_months) {
        return res.status(400).json({
          success: false,
          error: 'Tous les champs obligatoires doivent être remplis'
        });
      }

      const partner = await Partner.create({
        name,
        logo_url,
        description,
        official_website,
        interest_rate_min,
        interest_rate_max,
        min_loan_amount,
        max_loan_amount,
        min_duration_months,
        max_duration_months,
        certifications,
        is_active,
        display_order
      });

      res.status(201).json({
        success: true,
        message: 'Partenaire créé avec succès',
        data: partner
      });
    } catch (error) {
      console.error('Erreur création partenaire:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la création du partenaire'
      });
    }
  }

  // Mettre à jour un partenaire (admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const partner = await Partner.update(id, updateData);

      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partenaire non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Partenaire mis à jour avec succès',
        data: partner
      });
    } catch (error) {
      console.error('Erreur mise à jour partenaire:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour du partenaire'
      });
    }
  }

  // Supprimer un partenaire (admin)
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const partner = await Partner.delete(id);

      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partenaire non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Partenaire supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur suppression partenaire:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du partenaire'
      });
    }
  }

  // Statistiques des partenaires (admin)
  static async getStats(req, res) {
    try {
      const stats = await Partner.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erreur récupération stats partenaires:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des statistiques'
      });
    }
  }
}

module.exports = PartnerController;

// Made with Bob
