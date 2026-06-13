const CreditScore = require('../models/CreditScore');
const User = require('../models/User');

/**
 * Contrôleur CreditScore
 */
class CreditScoreController {
  /**
   * Récupérer le score de crédit de l'utilisateur connecté
   */
  static async getMyCreditScore(req, res) {
    try {
      const creditScore = await CreditScore.findByUserId(req.user.id);

      if (!creditScore) {
        return res.status(404).json({
          success: false,
          error: 'Score de crédit non trouvé'
        });
      }

      // Ajouter l'évaluation textuelle
      const rating = CreditScore.getScoreRating(creditScore.score);

      res.json({
        success: true,
        data: {
          ...creditScore,
          rating
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du score de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du score de crédit'
      });
    }
  }

  /**
   * Calculer et créer/mettre à jour le score de crédit de l'utilisateur
   */
  static async calculateMyCreditScore(req, res) {
    try {
      // Récupérer les données utilisateur
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      // Données pour le calcul du score
      const userData = {
        monthly_income: user.monthly_income,
        monthly_expenses: user.monthly_expenses,
        credit_history_length_months: req.body.credit_history_length_months || 0,
        number_of_active_credits: req.body.number_of_active_credits || 0,
        payment_history_rating: req.body.payment_history_rating || 'unknown',
        recent_credit_inquiries: req.body.recent_credit_inquiries || 0,
        negative_records: req.body.negative_records || null
      };

      // Calculer le score
      const calculatedScore = CreditScore.calculateScore(userData);

      // Calculer le ratio dette/revenu
      let debtToIncomeRatio = null;
      if (user.monthly_income && user.monthly_expenses) {
        debtToIncomeRatio = (user.monthly_expenses / user.monthly_income) * 100;
      }

      // Créer ou mettre à jour le score
      const scoreData = {
        user_id: req.user.id,
        score: calculatedScore,
        score_provider: 'internal',
        credit_history_length_months: userData.credit_history_length_months,
        number_of_active_credits: userData.number_of_active_credits,
        total_debt_amount: req.body.total_debt_amount || 0,
        payment_history_rating: userData.payment_history_rating,
        debt_to_income_ratio: debtToIncomeRatio,
        recent_credit_inquiries: userData.recent_credit_inquiries,
        negative_records: userData.negative_records,
        assessment_notes: req.body.assessment_notes || null
      };

      const creditScore = await CreditScore.upsert(scoreData);
      const rating = CreditScore.getScoreRating(creditScore.score);

      res.json({
        success: true,
        data: {
          ...creditScore,
          rating
        },
        message: 'Score de crédit calculé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors du calcul du score de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du calcul du score de crédit'
      });
    }
  }

  /**
   * Récupérer un score de crédit par ID (admin)
   */
  static async getById(req, res) {
    try {
      const creditScore = await CreditScore.findById(req.params.id);

      if (!creditScore) {
        return res.status(404).json({
          success: false,
          error: 'Score de crédit non trouvé'
        });
      }

      const rating = CreditScore.getScoreRating(creditScore.score);

      res.json({
        success: true,
        data: {
          ...creditScore,
          rating
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du score de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du score de crédit'
      });
    }
  }

  /**
   * Récupérer le score de crédit d'un utilisateur spécifique (admin)
   */
  static async getByUserId(req, res) {
    try {
      const creditScore = await CreditScore.findByUserId(req.params.userId);

      if (!creditScore) {
        return res.status(404).json({
          success: false,
          error: 'Score de crédit non trouvé pour cet utilisateur'
        });
      }

      const rating = CreditScore.getScoreRating(creditScore.score);

      res.json({
        success: true,
        data: {
          ...creditScore,
          rating
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du score de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du score de crédit'
      });
    }
  }

  /**
   * Récupérer tous les scores de crédit (admin)
   */
  static async getAll(req, res) {
    try {
      const filters = {
        min_score: req.query.min_score ? parseInt(req.query.min_score) : undefined,
        max_score: req.query.max_score ? parseInt(req.query.max_score) : undefined,
        payment_history_rating: req.query.payment_history_rating,
        score_provider: req.query.score_provider,
        sortBy: req.query.sortBy || 'score',
        order: req.query.order || 'DESC',
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const creditScores = await CreditScore.findAll(filters);

      // Ajouter l'évaluation textuelle à chaque score
      const scoresWithRating = creditScores.map(score => ({
        ...score,
        rating: CreditScore.getScoreRating(score.score)
      }));

      res.json({
        success: true,
        data: scoresWithRating,
        count: scoresWithRating.length,
        pagination: {
          limit: filters.limit,
          offset: filters.offset
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des scores de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des scores de crédit'
      });
    }
  }

  /**
   * Créer ou mettre à jour un score de crédit (admin)
   */
  static async upsertScore(req, res) {
    try {
      const {
        user_id,
        score,
        score_provider,
        credit_history_length_months,
        number_of_active_credits,
        total_debt_amount,
        payment_history_rating,
        debt_to_income_ratio,
        recent_credit_inquiries,
        negative_records,
        assessment_notes
      } = req.body;

      // Vérifier que l'utilisateur existe
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé'
        });
      }

      const scoreData = {
        user_id,
        score,
        score_provider,
        credit_history_length_months,
        number_of_active_credits,
        total_debt_amount,
        payment_history_rating,
        debt_to_income_ratio,
        recent_credit_inquiries,
        negative_records,
        assessment_notes
      };

      const creditScore = await CreditScore.upsert(scoreData);
      const rating = CreditScore.getScoreRating(creditScore.score);

      res.json({
        success: true,
        data: {
          ...creditScore,
          rating
        },
        message: 'Score de crédit enregistré avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du score de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'enregistrement du score de crédit'
      });
    }
  }

  /**
   * Supprimer un score de crédit (admin)
   */
  static async deleteScore(req, res) {
    try {
      const creditScore = await CreditScore.delete(req.params.id);

      if (!creditScore) {
        return res.status(404).json({
          success: false,
          error: 'Score de crédit non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Score de crédit supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du score de crédit:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du score de crédit'
      });
    }
  }

  /**
   * Récupérer les statistiques des scores de crédit (admin)
   */
  static async getStats(req, res) {
    try {
      const stats = await CreditScore.getStats();

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
   * Récupérer les meilleurs scores (admin)
   */
  static async getTopScores(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const topScores = await CreditScore.getTopScores(limit);

      const scoresWithRating = topScores.map(score => ({
        ...score,
        rating: CreditScore.getScoreRating(score.score)
      }));

      res.json({
        success: true,
        data: scoresWithRating,
        count: scoresWithRating.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleurs scores:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des meilleurs scores'
      });
    }
  }

  /**
   * Récupérer les scores obsolètes nécessitant une mise à jour (admin)
   */
  static async getOutdatedScores(req, res) {
    try {
      const days = parseInt(req.query.days) || 90;
      const outdatedScores = await CreditScore.findOutdated(days);

      const scoresWithRating = outdatedScores.map(score => ({
        ...score,
        rating: CreditScore.getScoreRating(score.score)
      }));

      res.json({
        success: true,
        data: scoresWithRating,
        count: scoresWithRating.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des scores obsolètes:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des scores obsolètes'
      });
    }
  }
}

module.exports = CreditScoreController;

// Made with Bob
