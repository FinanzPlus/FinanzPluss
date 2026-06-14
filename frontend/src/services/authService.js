import api, { handleApiError } from './api';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * Service d'authentification
 */
class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Sauvegarder les tokens et les données utilisateur
        this.saveAuthData(user, accessToken, refreshToken);
        
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email, password, recaptchaToken = null) {
    try {
      const config = recaptchaToken ? {
        headers: {
          'X-Recaptcha-Token': recaptchaToken
        }
      } : {};

      const response = await api.post('/auth/login', { email, password }, config);
      
      if (response.data.success) {
        const { user, accessToken, refreshToken } = response.data.data;
        
        // Sauvegarder les tokens et les données utilisateur
        this.saveAuthData(user, accessToken, refreshToken);
        
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Déconnexion
   */
  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Obtenir le profil de l'utilisateur connecté
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      
      if (response.data.success) {
        const { user } = response.data.data;
        
        // Mettre à jour les données utilisateur en local
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Mettre à jour le profil
   */
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        const { user } = response.data.data;
        
        // Mettre à jour les données utilisateur en local
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Demander la réinitialisation du mot de passe
   */
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(token, password) {
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password
      });
      
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error) {
      const errorData = handleApiError(error);
      return { success: false, message: errorData.message };
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  }

  /**
   * Obtenir l'utilisateur actuel depuis le localStorage
   */
  getCurrentUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Vérifier si l'utilisateur est admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * Sauvegarder les données d'authentification
   */
  saveAuthData(user, accessToken, refreshToken) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  /**
   * Obtenir le token d'accès
   */
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Obtenir le token de rafraîchissement
   */
  getRefreshToken() {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
}

// Exporter une instance unique du service
export default new AuthService();

// Made with Bob
