# 🔐 Guide : Connecter Google Analytics au Dashboard

## 📋 Prérequis

- Property ID Google Analytics : `503555450` ✅
- Accès à [Google Cloud Console](https://console.cloud.google.com)

## 🚀 Étapes de Configuration

### Étape 1 : Créer un Projet Google Cloud

1. Va sur [console.cloud.google.com](https://console.cloud.google.com)
2. Clique sur **"Créer un projet"** ou sélectionne un projet existant
3. Donne un nom au projet : `dashboard-systemeviral`
4. Clique sur **"Créer"**

### Étape 2 : Activer l'API Google Analytics

1. Dans le menu latéral, va dans **"APIs & Services" > "Library"**
2. Recherche **"Google Analytics Data API"**
3. Clique dessus et active l'API

### Étape 3 : Créer un Service Account

1. Va dans **"APIs & Services" > "Credentials"**
2. Clique sur **"+ CREATE CREDENTIALS"**
3. Sélectionne **"Service Account"**
4. Nom : `dashboard-analytics`
5. Clique sur **"CREATE AND CONTINUE"**
6. Rôle : Laisse par défaut ou choisis **"Viewer"**
7. Clique sur **"CONTINUE"** puis **"DONE"**

### Étape 4 : Générer une Clé JSON

1. Clique sur le service account que tu viens de créer
2. Va dans l'onglet **"Keys"**
3. Clique sur **"ADD KEY" > "Create new key"**
4. Sélectionne **JSON**
5. Télécharge le fichier (il contient tes credentials !)

### Étape 5 : Autoriser le Service Account dans Google Analytics

1. Va sur [analytics.google.com](https://analytics.google.com)
2. Sélectionne ta propriété (avec le Property ID 503555450)
3. Va dans **"Admin"** (icône engrenage)
4. Dans **"Property Access Management"**, clique sur **"+"**
5. Ajoute l'email du service account (se trouve dans le JSON téléchargé, champ `client_email`)
6. Donne la permission **"Read & Analyze"**

### Étape 6 : Configurer les Variables d'Environnement sur Netlify

1. Va sur [app.netlify.com](https://app.netlify.com)
2. Sélectionne ton projet **dashboard-systemeviral**
3. Va dans **"Site configuration" > "Environment variables"**
4. Clique sur **"Add a variable"**

Ajoute ces variables (depuis le fichier JSON téléchargé) :

```
GA_PROJECT_ID = ton_project_id
GA_PRIVATE_KEY_ID = ton_private_key_id
GA_PRIVATE_KEY = ton_private_key (garder les \n)
GA_CLIENT_EMAIL = ton_client_email
GA_CLIENT_ID = ton_client_id
```

⚠️  **IMPORTANT** : Pour `GA_PRIVATE_KEY`, copie TOUT le contenu entre les guillemets, y compris les `\n`

### Étape 7 : Installer les Dépendances

Le package.json a été mis à jour avec :
- `google-auth-library`
- `node-fetch`

Ces dépendances seront installées automatiquement par Netlify lors du build.

## ✅ Vérification

Une fois configuré :
1. Va sur `dashboard.systemeviral.com`
2. La section "Google Analytics" devrait afficher les vraies données
3. Les sources de trafic seront visibles

## 🔧 En cas de Problème

**Erreur "Missing credentials"** :
- Vérifie que toutes les variables d'environnement sont bien configurées sur Netlify
- Vérifie que tu n'as pas oublié de guillemets dans `GA_PRIVATE_KEY`

**Erreur "Permission denied"** :
- Vérifie que le service account est bien autorisé dans Google Analytics
- Vérifie que tu as activé l'API "Google Analytics Data API"

**Erreur "Property not found"** :
- Vérifie que le Property ID est correct (503555450)
- Vérifie que le service account a accès à cette propriété

## 📞 Support

Si tu as besoin d'aide, envoie :
- Une capture d'écran de l'erreur
- Les logs Netlify (site configuration > Functions logs)

