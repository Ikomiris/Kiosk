# Interface Kiosk Ikomiris

Interface tactile pour tablette en mode kiosque, conçue pour être utilisée avec **Fully Kiosk Browser**.

## Aperçu

Cette application web fournit une interface utilisateur simple et intuitive pour accéder à différents services en magasin via une tablette tactile.

### Services disponibles

1. **Prendre rendez-vous** - Accès au système de prise de rendez-vous
2. **Acheter une carte cadeau** - Achat de cartes cadeaux en ligne
3. **Créer un compte** - Création de compte client
4. **Consulter le catalogue** - Navigation dans le catalogue de produits
5. **Consulter la FAQ** - Accès aux questions fréquemment posées

## Installation

### Prérequis

- Tablette Android/iOS
- **Fully Kiosk Browser** (recommandé) ou navigateur web moderne
- Connexion internet

### Étapes d'installation

1. **Cloner ou télécharger** ce dépôt sur votre serveur web

2. **Configurer les URLs** des services dans `script.js` :
   ```javascript
   const CONFIG = {
       services: {
           appointment: {
               url: 'https://votre-site.com/rendez-vous',
               openInNewWindow: true
           },
           // ... autres services
       }
   };
   ```

3. **Ajouter les images** dans le dossier `assets/` :
   - `calendar.jpg` - Image pour "Prendre rendez-vous"
   - `gift.jpg` - Image pour "Carte cadeau"
   - `account.jpg` - Image pour "Créer un compte"
   - `iris.jpg` - Image pour "Catalogue"
   - `faq.jpg` - Image pour "FAQ"

4. **Héberger l'application** sur un serveur web accessible par la tablette

## Configuration de Fully Kiosk Browser

### Installation sur la tablette

1. Télécharger **Fully Kiosk Browser** depuis le Play Store (Android) ou App Store (iOS)
2. Ouvrir l'application et accéder aux paramètres (code PIN par défaut : 1234)

### Configuration recommandée

#### Paramètres généraux
- **Start URL** : `https://votre-serveur.com/kiosk/index.html`
- **Enable Kiosk Mode** : Activé
- **Autostart Fully** : Activé

#### Paramètres d'écran
- **Screen On** : Toujours allumé
- **Brightness** : 100%
- **Screen Saver** : Désactivé
- **Screen Orientation** : Paysage (ou selon votre tablette)

#### Paramètres de sécurité
- **Disable Status Bar** : Activé
- **Disable System Bar** : Activé
- **Block Screenshots** : Activé (optionnel)
- **Clear Cache on Reload** : Activé

#### Paramètres de navigation
- **Enable Pull-to-Refresh** : Désactivé
- **Show Navigation Bar** : Désactivé
- **Disable Long Touch** : Activé
- **Block Pinch-to-Zoom** : Activé

#### Timeout et inactivité
- **Reload on Idle** : Activé
- **Idle Time** : 120 secondes (2 minutes)
- **On Idle Action** : Load Start URL

## Configuration avancée

### Personnalisation des couleurs

Dans `styles.css`, vous pouvez modifier :

```css
/* Logo color */
.logo-i {
    color: #5bc5c5; /* Couleur des 'i' */
}

/* Button text color */
.card-text {
    color: #f9b233; /* Couleur du texte des boutons */
}
```

### Timeout d'inactivité

Dans `script.js`, ajustez le timeout :

```javascript
const CONFIG = {
    // ...
    inactivityTimeout: 120000, // En millisecondes (120000 = 2 minutes)
};
```

Mettre à `0` pour désactiver.

### Mode d'ouverture des liens

Pour chaque service, vous pouvez choisir :
- `openInNewWindow: true` - Ouvre dans une nouvelle fenêtre/onglet
- `openInNewWindow: false` - Navigation dans la même fenêtre

## Structure des fichiers

```
kiosk/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # Logique JavaScript
├── config.json         # Configuration JSON
├── README.md           # Documentation
├── visuelKiosk.jpg     # Maquette de design
└── assets/             # Images des services
    ├── calendar.jpg
    ├── gift.jpg
    ├── account.jpg
    ├── iris.jpg
    └── faq.jpg
```

## Optimisations tactiles

L'interface inclut plusieurs optimisations pour l'utilisation tactile :

- Désactivation du zoom pinch
- Prévention du double-tap pour zoomer
- Désactivation du menu contextuel
- Prévention des gestes de navigation
- Feedback visuel au toucher
- Boutons de grande taille (optimisés pour les doigts)

## Compatibilité

- **Fully Kiosk Browser** (recommandé)
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Maintenance

### Mise à jour des URLs

Modifiez les URLs dans `script.js` section `CONFIG.services`

### Mise à jour des images

Remplacez les images dans le dossier `assets/` en conservant les mêmes noms de fichiers

### Redémarrage de l'interface

L'interface se recharge automatiquement après la période d'inactivité configurée.

Pour forcer un rechargement :
- Dans Fully Kiosk : Secouer la tablette ou utiliser le code PIN
- Dans un navigateur : Rafraîchir la page (F5)

## Dépannage

### L'interface ne s'affiche pas correctement
- Vérifiez que tous les fichiers sont présents sur le serveur
- Consultez la console du navigateur pour les erreurs (F12)
- Vérifiez que les chemins vers les images sont corrects

### Les boutons ne fonctionnent pas
- Vérifiez que les URLs sont correctement configurées dans `script.js`
- Vérifiez la connexion internet
- Consultez les logs de la console JavaScript

### Fully Kiosk ne démarre pas automatiquement
- Vérifiez que "Autostart Fully" est activé dans les paramètres
- Vérifiez les permissions Android (Autoriser le démarrage automatique)
- Redémarrez la tablette

### L'écran se met en veille
- Vérifiez "Screen On" dans Fully Kiosk
- Vérifiez les paramètres d'alimentation de la tablette

## Support

Pour toute question ou problème, consultez :
- Documentation de Fully Kiosk Browser : https://www.fully-kiosk.com
- Issues GitHub de ce projet

## Licence

Ce projet est propriétaire de Ikomiris.

---

**Version** : 1.0.0
**Dernière mise à jour** : Novembre 2024
