import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';

// Créer le contexte
const AuthContext = createContext(null);

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Charger l'utilisateur au montage du composant
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
            
            // Optionnel : Rafraîchir les données utilisateur depuis le serveur
            const result = await authService.getProfile();
            if (result.success) {
              setUser(result.user);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Inscription
   */
  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { success: false, message: 'Erreur lors de l\'inscription' };
    }
  };

  /**
   * Connexion
   */
  const login = async (email, password, recaptchaToken = null) => {
    try {
      const result = await authService.login(email, password, recaptchaToken);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, message: 'Erreur lors de la connexion' };
    }
  };

  /**
   * Déconnexion
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Mettre à jour le profil
   */
  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      return { success: false, message: 'Erreur lors de la mise à jour du profil' };
    }
  };

  /**
   * Changer le mot de passe
   */
  const changePassword = async (oldPassword, newPassword) => {
    try {
      return await authService.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      return { success: false, message: 'Erreur lors du changement de mot de passe' };
    }
  };

  /**
   * Vérifier si l'utilisateur est admin
   */
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  /**
   * Rafraîchir les données utilisateur
   */
  const refreshUser = async () => {
    try {
      const result = await authService.getProfile();
      
      if (result.success) {
        setUser(result.user);
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du profil:', error);
      return { success: false, message: 'Erreur lors du rafraîchissement du profil' };
    }
  };

  // Valeur du contexte
  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Made with Bob
