// Configuration - URLs des services
// Modifiez ces URLs selon vos besoins
const CONFIG = {
    services: {
        appointment: {
            url: 'https://calendly.com/calcaen',
            openInNewWindow: false
        },
        giftcard: {
            url: 'https://ikomiris.ikomiris.eu/giftcard',
            openInNewWindow: false
        },
        account: {
            url: 'account.html',
            openInNewWindow: false
        },
        catalog: {
            url: 'https://ikomiris.com/catalogue-des-montages-et-effets/?kiosque=1',
            openInNewWindow: false
        },
        faq: {
            url: 'https://ikomiris.com/faq-foire-aux-questions/?kiosque=1',
            openInNewWindow: false
        },
        pricing: {
            url: 'https://ikomiris.com/tarif-des-tirages-et-prises-de-vues/?kiosque=1',
            openInNewWindow: false
        }
    },
    // Timeout d'inactivité en millisecondes (0 = désactivé)
    inactivityTimeout: 120000, // 2 minutes
    // Activer le mode kiosk
    kioskMode: true
};

// Variables globales
let inactivityTimer = null;

// Détection de Fully Kiosk Browser
function isFullyKioskBrowser() {
    return typeof fully !== 'undefined';
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kiosk Interface Initialized');

    // Activer le mode kiosk si configuré
    if (CONFIG.kioskMode) {
        document.body.classList.add('kiosk-mode');
    }

    // Désactiver le zoom sur mobile
    disablePinchZoom();

    // Attacher les événements aux cartes de service
    attachServiceCardEvents();

    // Démarrer le timer d'inactivité si configuré
    if (CONFIG.inactivityTimeout > 0) {
        startInactivityTimer();
    }

    // Configuration spécifique pour Fully Kiosk Browser
    if (isFullyKioskBrowser()) {
        setupFullyKiosk();
    }

    // Empêcher le menu contextuel
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Empêcher les gestes de navigation
    preventNavigationGestures();
});

// Désactiver le pinch-zoom
function disablePinchZoom() {
    document.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Empêcher les gestes de navigation
function preventNavigationGestures() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchmove', function(e) {
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Empêcher le swipe horizontal
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Attacher les événements aux cartes de service
function attachServiceCardEvents() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', handleServiceClick);

        // Feedback tactile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });

        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// Gérer le clic sur une carte de service
function handleServiceClick(event) {
    const card = event.currentTarget;
    const serviceName = card.getAttribute('data-service');

    if (!serviceName || !CONFIG.services[serviceName]) {
        console.error('Service not configured:', serviceName);
        return;
    }

    const service = CONFIG.services[serviceName];

    // Ajouter une animation de chargement
    card.classList.add('loading');

    // Réinitialiser le timer d'inactivité
    resetInactivityTimer();

    // Ouvrir l'URL
    setTimeout(() => {
        openServiceUrl(service.url, service.openInNewWindow);
        card.classList.remove('loading');
    }, 300);
}

// Ouvrir une URL de service
function openServiceUrl(url, openInNewWindow) {
    console.log('Opening service URL:', url);

    if (isFullyKioskBrowser()) {
        // Utiliser l'API Fully Kiosk
        if (openInNewWindow) {
            fully.startApplication(url);
        } else {
            window.location.href = url;
        }
    } else {
        // Navigation standard
        if (openInNewWindow) {
            window.open(url, '_blank');
        } else {
            window.location.href = url;
        }
    }
}

// Configuration spécifique pour Fully Kiosk Browser
function setupFullyKiosk() {
    console.log('Fully Kiosk Browser detected');

    // Activer le mode plein écran
    if (typeof fully !== 'undefined') {
        fully.turnScreenOn();
        fully.setScreenBrightness(255);

        // Empêcher la mise en veille
        fully.keepScreenOn(true);
    }
}

// Démarrer le timer d'inactivité
function startInactivityTimer() {
    // Événements à surveiller pour l'activité utilisateur
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });

    resetInactivityTimer();
}

// Réinitialiser le timer d'inactivité
function resetInactivityTimer() {
    if (inactivityTimer) {
        clearTimeout(inactivityTimer);
    }

    if (CONFIG.inactivityTimeout > 0) {
        inactivityTimer = setTimeout(handleInactivity, CONFIG.inactivityTimeout);
    }
}

// Gérer l'inactivité
function handleInactivity() {
    console.log('Inactivity timeout reached');

    // Retourner à la page d'accueil
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
        window.location.href = '/';
    }

    // Dans Fully Kiosk, on peut recharger la page
    if (isFullyKioskBrowser() && typeof fully !== 'undefined') {
        fully.loadStartUrl();
    }
}

// Fonction utilitaire pour recharger l'interface
function reloadInterface() {
    window.location.reload();
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
});

// Export des fonctions pour utilisation externe si nécessaire
if (typeof window !== 'undefined') {
    window.KioskInterface = {
        reload: reloadInterface,
        resetTimer: resetInactivityTimer,
        config: CONFIG
    };
}
