// Configuration de l'API
const API_CONFIG = {
    endpoint: 'https://btrjln6o7e.execute-api.eu-west-1.amazonaws.com/backend/bookly/64ca41db866f236a74b14d33',
    tenant: '64c7c531cdd2280e501c60d1'
};

// Timeout d'inactivité (2 minutes)
const INACTIVITY_TIMEOUT = 120000;
let inactivityTimer = null;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Account Form Initialized');

    // Empêcher le menu contextuel
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // Désactiver le zoom sur mobile
    disablePinchZoom();

    // Attacher l'événement de soumission du formulaire
    const form = document.getElementById('accountForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Démarrer le timer d'inactivité
    startInactivityTimer();

    // Formater automatiquement le numéro de téléphone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // Valider le code postal
    const postcodeInput = document.getElementById('postcode');
    if (postcodeInput) {
        postcodeInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
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

// Formater le numéro de téléphone
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{2})(?=\d)/g, '$1 ');
    e.target.value = formattedValue.trim();
}

// Gérer la soumission du formulaire
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = document.getElementById('submitButton');
    const buttonText = submitButton.querySelector('.button-text');
    const buttonLoader = submitButton.querySelector('.button-loader');
    const messageDiv = document.getElementById('formMessage');

    // Désactiver le bouton et afficher le loader
    submitButton.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'inline-block';
    messageDiv.style.display = 'none';

    // Réinitialiser le timer d'inactivité
    resetInactivityTimer();

    // Récupérer les données du formulaire
    const formData = {
        tenant: API_CONFIG.tenant,
        first_name: document.getElementById('firstName').value.trim(),
        last_name: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.replace(/\s/g, ''),
        street: document.getElementById('street').value.trim(),
        address_bis: document.getElementById('addressBis').value.trim(),
        postecode: document.getElementById('postcode').value.trim(),
        city: document.getElementById('city').value.trim(),
        country: document.getElementById('country').value.trim() || 'France'
    };

    try {
        console.log('Sending form data:', formData);

        // Envoyer les données à l'API
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            // Succès
            const responseData = await response.json();
            console.log('Success:', responseData);

            showMessage('Votre compte a été créé avec succès !', 'success');

            // Réinitialiser le formulaire
            form.reset();
            document.getElementById('country').value = 'France';

            // Rediriger vers la page d'accueil après 3 secondes
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);

        } else {
            // Erreur de l'API
            let errorMessage = 'Une erreur est survenue lors de la création du compte.';

            try {
                const errorData = await response.json();
                console.error('Error response:', errorData);

                if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                console.error('Could not parse error response');
            }

            showMessage(errorMessage, 'error');
        }

    } catch (error) {
        console.error('Network error:', error);
        showMessage('Erreur de connexion. Veuillez réessayer.', 'error');
    } finally {
        // Réactiver le bouton
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

// Afficher un message
function showMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = 'form-message ' + type;
    messageDiv.style.display = 'block';

    // Faire défiler vers le message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Démarrer le timer d'inactivité
function startInactivityTimer() {
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

    inactivityTimer = setTimeout(handleInactivity, INACTIVITY_TIMEOUT);
}

// Gérer l'inactivité
function handleInactivity() {
    console.log('Inactivity timeout reached - returning to home');
    window.location.href = 'index.html';
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
});
