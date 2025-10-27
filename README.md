# Dashboard Système Viral

## 🔐 Accès

**URL**: `dashboard.systemeviral.com`

**Mot de passe**: `SystèmeViral2024` (⚠️ **À CHANGER EN PRODUCTION !**)

## 📝 Configuration

### Changer le mot de passe

1. Édite `src/pages/login.astro`
2. Change la ligne:
   ```javascript
   const CORRECT_PASSWORD = "SystèmeViral2024";
   ```
3. Commit et push:
   ```bash
   git add src/pages/login.astro
   git commit -m "security: Update dashboard password"
   git push
   ```

### Fonctionnalités

- ✅ Page de login personnalisée avec le style du site
- ✅ Protection par session (expire après 24h)
- ✅ Déconnexion via bouton
- ✅ Intégration Google Analytics
- ✅ Affichage des parcours de leads

## 🚀 Déploiement

Le site est automatiquement déployé sur Netlify à chaque push sur `main`.

## 🔧 Configuration requise

- Node.js 18+
- Astro 5+

## 📊 API Endpoints

- `/api/journeys` - Parcours des leads
- `/api/google-analytics` - Données Google Analytics

## 🔒 Sécurité

Le mot de passe est vérifié côté client (sessionStorage). Pour une sécurité renforcée, utilisez Netlify Identity ou implémentez une vérification côté serveur.
