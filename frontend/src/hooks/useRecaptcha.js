/**
 * CUSTOM HOOK - GOOGLE reCAPTCHA v3
 * Hook React pour gérer Google reCAPTCHA v3 de manière simple
 * FinanzPlus Austria
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer reCAPTCHA v3
 * @param {string} action - Action à enregistrer (ex: 'login', 'contact', 'register')
 * @returns {Object} { executeRecaptcha, isReady, error }
 */
const useRecaptcha = (action = 'submit') => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Charger le script reCAPTCHA
  useEffect(() => {
    if (!siteKey) {
      console.error('[reCAPTCHA] Site key manquante dans .env');
      setError('Configuration reCAPTCHA manquante');
      return;
    }

    // Vérifier si le script est déjà chargé
    if (window.grecaptcha && window.grecaptcha.ready) {
      window.grecaptcha.ready(() => {
        setIsReady(true);
      });
      return;
    }

    // Charger le script reCAPTCHA
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptcha.ready(() => {
        setIsReady(true);
        console.log('[reCAPTCHA] Script chargé et prêt');
      });
    };

    script.onerror = () => {
      setError('Erreur lors du chargement de reCAPTCHA');
      console.error('[reCAPTCHA] Erreur de chargement du script');
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Ne pas retirer le script car il peut être utilisé par d'autres composants
    };
  }, [siteKey]);

  /**
   * Exécute reCAPTCHA et retourne le token
   * @returns {Promise<string|null>} Token reCAPTCHA ou null en cas d'erreur
   */
  const executeRecaptcha = useCallback(async () => {
    if (!isReady) {
      console.warn('[reCAPTCHA] Script pas encore prêt');
      return null;
    }

    if (!window.grecaptcha) {
      console.error('[reCAPTCHA] grecaptcha non disponible');
      setError('reCAPTCHA non disponible');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      console.log(`[reCAPTCHA] Token généré pour l'action: ${action}`);
      return token;
    } catch (err) {
      console.error('[reCAPTCHA] Erreur lors de l\'exécution:', err);
      setError('Erreur lors de la génération du token reCAPTCHA');
      return null;
    }
  }, [isReady, siteKey, action]);

  return {
    executeRecaptcha,
    isReady,
    error
  };
};

export default useRecaptcha;

// Made with ❤️ by Bob for FinanzPlus Austria

// Made with Bob
