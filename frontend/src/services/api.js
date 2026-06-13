import axios from 'axios';
import { API_URL, API_TIMEOUT, STORAGE_KEYS } from '@/utils/constants';

// Créer une instance axios avec configuration par défaut
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si le token est expiré (401) et qu'on n'a pas déjà tenté de rafraîchir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          // Tenter de rafraîchir le token
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken
          });

          const { accessToken } = response.data.data;
          
          // Sauvegarder le nouveau token
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
          
          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        // Rediriger vers la page de connexion
        window.location.href = '/anmelden';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fonction helper pour gérer les erreurs
export const handleApiError = (error) => {
  if (error.response) {
    // Le serveur a répondu avec un code d'erreur
    return {
      message: error.response.data?.message || 'Une erreur est survenue',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // La requête a été envoyée mais pas de réponse
    return {
      message: 'Pas de réponse du serveur. Vérifiez votre connexion.',
      status: 0
    };
  } else {
    // Erreur lors de la configuration de la requête
    return {
      message: error.message || 'Une erreur est survenue',
      status: 0
    };
  }
};

// Exporter l'instance axios configurée
export default api;

// Made with Bob

// Services API pour les produits
export const productService = {
  // Récupérer tous les produits
  getAll: (params) => api.get('/products', { params }),
  
  // Récupérer un produit par ID
  getById: (id) => api.get(`/products/${id}`),
  
  // Récupérer les voitures
  getCars: (params) => api.get('/products/cars', { params }),
  
  // Récupérer les meubles
  getFurniture: (params) => api.get('/products/furniture', { params }),
  
  // Créer un produit (admin)
  create: (data) => api.post('/products', data),
  
  // Mettre à jour un produit (admin)
  update: (id, data) => api.put(`/products/${id}`, data),
  
  // Supprimer un produit (admin)
  delete: (id) => api.delete(`/products/${id}`)
};

// Services API pour les commentaires
export const commentService = {
  // Récupérer les commentaires d'un produit
  getByProduct: (productId) => api.get(`/comments/product/${productId}`),
  
  // Ajouter un commentaire
  create: (data) => api.post('/comments', data),
  
  // Approuver un commentaire (admin)
  approve: (id) => api.put(`/comments/${id}/approve`),
  
  // Rejeter un commentaire (admin)
  reject: (id) => api.put(`/comments/${id}/reject`),
  
  // Supprimer un commentaire (admin)
  delete: (id) => api.delete(`/comments/${id}`)
};

// Services API pour les services financiers
export const financialService = {
  // Calculer un prêt
  calculate: (data) => api.post('/financial/calculate', data),
  
  // Demander un financement
  request: (data) => api.post('/financial/request', data),
  
  // Récupérer les demandes (admin)
  getRequests: () => api.get('/financial/requests')
};

// Services API pour le contact
export const contactService = {
  // Récupérer les horaires d'ouverture
  getHours: () => api.get('/contact/hours'),
  
  // Récupérer le statut (ouvert/fermé)
  getStatus: () => api.get('/contact/status'),
  
  // Envoyer un message
  sendMessage: (data) => api.post('/contact/message', data)
};
