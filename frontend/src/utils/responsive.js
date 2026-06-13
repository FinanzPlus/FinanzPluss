/**
 * FINANZPLUS AUSTRIA - Responsive Utilities
 * Utilitaires JavaScript pour le responsive design
 */

/**
 * Breakpoints (correspond à responsive.css)
 */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

/**
 * Détecte le type d'appareil actuel
 * @returns {string} 'mobile' | 'tablet' | 'desktop' | 'wide'
 */
export const getDeviceType = () => {
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'mobile';
  if (width < BREAKPOINTS.desktop) return 'tablet';
  if (width < BREAKPOINTS.wide) return 'desktop';
  return 'wide';
};

/**
 * Vérifie si l'appareil est mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return window.innerWidth < BREAKPOINTS.tablet;
};

/**
 * Vérifie si l'appareil est une tablette
 * @returns {boolean}
 */
export const isTablet = () => {
  const width = window.innerWidth;
  return width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
};

/**
 * Vérifie si l'appareil est un desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  return window.innerWidth >= BREAKPOINTS.desktop;
};

/**
 * Détecte si l'appareil supporte le touch
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Hook pour écouter les changements de taille d'écran
 * @param {Function} callback - Fonction appelée lors du resize
 * @param {number} delay - Délai de debounce en ms (défaut: 250)
 */
export const useWindowResize = (callback, delay = 250) => {
  let timeoutId;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback({
        width: window.innerWidth,
        height: window.innerHeight,
        deviceType: getDeviceType(),
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop()
      });
    }, delay);
  };

  window.addEventListener('resize', handleResize);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
    clearTimeout(timeoutId);
  };
};

/**
 * Détecte l'orientation de l'appareil
 * @returns {string} 'portrait' | 'landscape'
 */
export const getOrientation = () => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * Vérifie si l'utilisateur préfère le mode réduit de mouvement
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Vérifie si l'utilisateur préfère le dark mode
 * @returns {boolean}
 */
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Obtient les informations complètes sur l'appareil
 * @returns {Object}
 */
export const getDeviceInfo = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    deviceType: getDeviceType(),
    isMobile: isMobile(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
    isTouchDevice: isTouchDevice(),
    orientation: getOrientation(),
    prefersReducedMotion: prefersReducedMotion(),
    prefersDarkMode: prefersDarkMode(),
    pixelRatio: window.devicePixelRatio || 1,
    userAgent: navigator.userAgent
  };
};

/**
 * Scroll vers un élément avec animation smooth
 * @param {string|HTMLElement} target - Sélecteur CSS ou élément DOM
 * @param {Object} options - Options de scroll
 */
export const smoothScrollTo = (target, options = {}) => {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
  
  if (!element) return;

  const defaultOptions = {
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
    ...options
  };

  element.scrollIntoView(defaultOptions);
};

/**
 * Désactive le scroll (utile pour les modals)
 */
export const disableScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${getScrollbarWidth()}px`;
};

/**
 * Réactive le scroll
 */
export const enableScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

/**
 * Obtient la largeur de la scrollbar
 * @returns {number}
 */
export const getScrollbarWidth = () => {
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

/**
 * Vérifie si un élément est visible dans le viewport
 * @param {HTMLElement} element
 * @param {number} threshold - Pourcentage de visibilité requis (0-1)
 * @returns {boolean}
 */
export const isElementInViewport = (element, threshold = 0) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
  const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

  return vertInView && horInView;
};

/**
 * Intersection Observer pour lazy loading et animations
 * @param {string} selector - Sélecteur CSS des éléments à observer
 * @param {Function} callback - Fonction appelée quand l'élément est visible
 * @param {Object} options - Options de l'observer
 */
export const observeElements = (selector, callback, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, defaultOptions);

  const elements = document.querySelectorAll(selector);
  elements.forEach(el => observer.observe(el));

  return observer;
};

/**
 * Ajoute des animations au scroll
 * @param {string} selector - Sélecteur CSS des éléments à animer
 * @param {string} animationClass - Classe CSS d'animation
 */
export const addScrollAnimations = (selector = '.animate-on-scroll', animationClass = 'animate-fade-in') => {
  if (prefersReducedMotion()) return;

  observeElements(selector, (element) => {
    element.classList.add(animationClass);
  }, { threshold: 0.2 });
};

/**
 * Gère le menu mobile (hamburger)
 */
export class MobileMenu {
  constructor(toggleSelector, menuSelector) {
    this.toggle = document.querySelector(toggleSelector);
    this.menu = document.querySelector(menuSelector);
    this.isOpen = false;

    if (this.toggle && this.menu) {
      this.init();
    }
  }

  init() {
    this.toggle.addEventListener('click', () => this.toggleMenu());
    
    // Fermer au clic sur un lien
    const links = this.menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    // Fermer au clic en dehors
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menu.contains(e.target) && !this.toggle.contains(e.target)) {
        this.close();
      }
    });

    // Fermer à l'échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  toggleMenu() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.menu.classList.add('active');
    this.toggle.classList.add('active');
    this.isOpen = true;
    disableScroll();
  }

  close() {
    this.menu.classList.remove('active');
    this.toggle.classList.remove('active');
    this.isOpen = false;
    enableScroll();
  }
}

/**
 * Gère les images responsive avec lazy loading
 * @param {string} selector - Sélecteur des images
 */
export const lazyLoadImages = (selector = 'img[data-src]') => {
  const images = document.querySelectorAll(selector);

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }

        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

/**
 * Adapte la hauteur du viewport pour mobile (fix pour barre d'adresse)
 */
export const setVhProperty = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

/**
 * Initialise les utilitaires responsive
 */
export const initResponsive = () => {
  // Set VH property
  setVhProperty();
  window.addEventListener('resize', setVhProperty);

  // Lazy load images
  lazyLoadImages();

  // Add scroll animations
  addScrollAnimations();

  // Log device info (dev only)
  if (process.env.NODE_ENV === 'development') {
    console.log('Device Info:', getDeviceInfo());
  }
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (func, wait = 250) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 * @param {Function} func
 * @param {number} limit
 * @returns {Function}
 */
export const throttle = (func, limit = 250) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Export default pour import facile
export default {
  BREAKPOINTS,
  getDeviceType,
  isMobile,
  isTablet,
  isDesktop,
  isTouchDevice,
  useWindowResize,
  getOrientation,
  prefersReducedMotion,
  prefersDarkMode,
  getDeviceInfo,
  smoothScrollTo,
  disableScroll,
  enableScroll,
  getScrollbarWidth,
  isElementInViewport,
  observeElements,
  addScrollAnimations,
  MobileMenu,
  lazyLoadImages,
  setVhProperty,
  initResponsive,
  debounce,
  throttle
};

// Made with Bob
