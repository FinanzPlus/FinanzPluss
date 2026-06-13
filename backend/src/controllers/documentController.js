const Document = require('../models/Document');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

/**
 * Configuration de Multer pour le téléchargement de fichiers
 */
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/documents');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Types de fichiers autorisés
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés: PDF, JPG, PNG, DOC, DOCX'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  }
});

/**
 * Contrôleur Document
 */
class DocumentController {
  /**
   * Télécharger un nouveau document
   */
  static uploadDocument = [
    upload.single('document'),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'Aucun fichier fourni'
          });
        }

        const { document_type, loan_request_id } = req.body;

        if (!document_type) {
          // Supprimer le fichier téléchargé
          await fs.unlink(req.file.path);
          return res.status(400).json({
            success: false,
            error: 'Le type de document est requis'
          });
        }

        const documentData = {
          user_id: req.user.id,
          loan_request_id: loan_request_id || null,
          document_type,
          file_name: req.file.originalname,
          file_path: req.file.path,
          file_size: req.file.size,
          mime_type: req.file.mimetype
        };

        const document = await Document.create(documentData);

        res.status(201).json({
          success: true,
          data: document,
          message: 'Document téléchargé avec succès'
        });
      } catch (error) {
        console.error('Erreur lors du téléchargement du document:', error);
        
        // Supprimer le fichier en cas d'erreur
        if (req.file) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Erreur lors de la suppression du fichier:', unlinkError);
          }
        }

        res.status(500).json({
          success: false,
          error: 'Erreur lors du téléchargement du document'
        });
      }
    }
  ];

  /**
   * Récupérer tous les documents de l'utilisateur connecté
   */
  static async getMyDocuments(req, res) {
    try {
      const filters = {
        document_type: req.query.document_type,
        verification_status: req.query.verification_status,
        loan_request_id: req.query.loan_request_id
      };

      const documents = await Document.findByUserId(req.user.id, filters);

      res.json({
        success: true,
        data: documents,
        count: documents.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des documents'
      });
    }
  }

  /**
   * Récupérer un document par ID
   */
  static async getById(req, res) {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document non trouvé'
        });
      }

      // Vérifier que l'utilisateur a le droit d'accéder à ce document
      if (req.user.role !== 'admin' && document.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
      }

      res.json({
        success: true,
        data: document
      });
    } catch (error) {
      console.error('Erreur lors de la récupération du document:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du document'
      });
    }
  }

  /**
   * Télécharger un fichier document
   */
  static async downloadDocument(req, res) {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document non trouvé'
        });
      }

      // Vérifier que l'utilisateur a le droit d'accéder à ce document
      if (req.user.role !== 'admin' && document.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
      }

      // Vérifier que le fichier existe
      try {
        await fs.access(document.file_path);
      } catch {
        return res.status(404).json({
          success: false,
          error: 'Fichier non trouvé sur le serveur'
        });
      }

      res.download(document.file_path, document.file_name);
    } catch (error) {
      console.error('Erreur lors du téléchargement du document:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors du téléchargement du document'
      });
    }
  }

  /**
   * Supprimer un document
   */
  static async deleteDocument(req, res) {
    try {
      const document = await Document.findById(req.params.id);

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document non trouvé'
        });
      }

      // Vérifier que l'utilisateur a le droit de supprimer ce document
      if (req.user.role !== 'admin' && document.user_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Accès non autorisé'
        });
      }

      // Supprimer le fichier physique
      try {
        await fs.unlink(document.file_path);
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
      }

      // Supprimer l'entrée de la base de données
      await Document.delete(req.params.id);

      res.json({
        success: true,
        message: 'Document supprimé avec succès'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du document'
      });
    }
  }

  /**
   * Récupérer tous les documents (admin)
   */
  static async getAllDocuments(req, res) {
    try {
      const filters = {
        verification_status: req.query.verification_status,
        document_type: req.query.document_type,
        user_id: req.query.user_id,
        sortBy: req.query.sortBy || 'created_at',
        order: req.query.order || 'DESC',
        limit: parseInt(req.query.limit) || 50,
        offset: parseInt(req.query.offset) || 0
      };

      const documents = await Document.findAll(filters);

      res.json({
        success: true,
        data: documents,
        count: documents.length,
        pagination: {
          limit: filters.limit,
          offset: filters.offset
        }
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des documents'
      });
    }
  }

  /**
   * Mettre à jour le statut de vérification d'un document (admin)
   */
  static async updateVerificationStatus(req, res) {
    try {
      const { status, notes } = req.body;

      const document = await Document.updateVerificationStatus(
        req.params.id,
        status,
        notes,
        req.user.id
      );

      if (!document) {
        return res.status(404).json({
          success: false,
          error: 'Document non trouvé'
        });
      }

      res.json({
        success: true,
        data: document,
        message: 'Statut de vérification mis à jour'
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la mise à jour du statut'
      });
    }
  }

  /**
   * Récupérer les statistiques des documents (admin)
   */
  static async getStats(req, res) {
    try {
      const stats = await Document.getStats();
      const countByStatus = await Document.countByStatus();

      res.json({
        success: true,
        data: {
          ...stats,
          by_status: countByStatus
        }
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
   * Récupérer les documents en attente de vérification (admin)
   */
  static async getPendingVerification(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const documents = await Document.findPendingVerification(limit);

      res.json({
        success: true,
        data: documents,
        count: documents.length
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des documents en attente:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des documents en attente'
      });
    }
  }
}

module.exports = DocumentController;

// Made with Bob
