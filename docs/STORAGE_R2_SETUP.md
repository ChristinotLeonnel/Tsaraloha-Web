# Configuration du Stockage d'Objets Cloudflare R2 (Distribution Directe TSA)

Ce document décrit la configuration de l'infrastructure de distribution directe haute performance pour les installateurs et archives binaires volumineux de **Tsaraloha Structural Analysis (TSA)**.

---

## 1. Pourquoi Cloudflare R2 ?

- **Téléchargement direct sans intermédiaire** : Les utilisateurs téléchargent l'exécutable directement depuis le domaine officiel sans passer par l'interface GitHub, sans compte GitHub et sans restriction de débit.
- **Zéro coût de bande passante sortante (No Egress Fees)** : Les installateurs (de ~66.5 Mo à plus de 1 Go) peuvent être téléchargés des milliers de fois sans générer de facturation au gigaoctet.
- **Reprise de téléchargement native (HTTP Range requests / RFC 7233)** : Les navigateurs et gestionnaires de téléchargement peuvent reprendre un téléchargement interrompu par une coupure réseau sans recommencer depuis le début.
- **Sécurité et souveraineté** : Les clés API secrètes de publication ne sont jamais exposées côté client ni dans le code source du site web.

---

## 2. Création du Bucket R2 dans Cloudflare

1. Connectez-vous au tableau de bord Cloudflare : [dash.cloudflare.com](https://dash.cloudflare.com).
2. Dans le menu de gauche, rendez-vous dans **R2** > **Overview**.
3. Cliquez sur **Create bucket**.
4. Définissez les paramètres suivants :
   - **Bucket name** : `tsa-downloads`
   - **Location** : *Automatic* (ou *Western Europe* / WNAM selon votre zone préférentielle).
5. Cliquez sur **Create Bucket**.

---

## 3. Configuration du Domaine Personnalisé (`downloads.tsaraloha.org`)

Pour que les URLs soient professionnelles et indépendantes de tout fournisseur :

1. Dans votre bucket `tsa-downloads`, cliquez sur l'onglet **Settings**.
2. Dans la section **Public Access**, repérez **Custom Domains**.
3. Cliquez sur **Connect Domain**.
4. Saisissez le sous-domaine de téléchargement :
   `downloads.tsaraloha.org`
5. Cloudflare configurera automatiquement le certificat SSL/TLS HTTPS et le routage DNS.
6. Vérifiez que les URLs suivantes sont désormais accessibles :
   `https://downloads.tsaraloha.org/releases/TSA-0.1.0-windows-x64-setup.exe`
   `https://downloads.tsaraloha.org/releases/SHA256SUMS.txt`

---

## 4. Configuration des Règles CORS et En-têtes HTTP

Toujours dans les paramètres de votre bucket (`Settings` > `CORS Policy`), ajoutez la politique suivante pour permettre aux scripts de vérification du site web de lire les en-têtes `Content-Length` et de valider les plages d'octets :

```json
[
  {
    "AllowedOrigins": [
      "https://tsaraloha.org",
      "https://christinotleonnel.github.io",
      "http://localhost:5173"
    ],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Content-Length", "Accept-Ranges", "Content-Type", "ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 5. Génération des Identifiants de Publication Sécurisés (API Token)

Pour permettre au script de publication `scripts/release/upload-r2.ps1` d'envoyer les packages vers le bucket :

1. Dans Cloudflare, rendez-vous dans **R2** > **Manage R2 API Tokens**.
2. Cliquez sur **Create API Token**.
3. Nom du jeton : `TSA Package Publisher`.
4. Permissions : **Object Read & Write**.
5. Spécifiez l'accès restreint au seul bucket : `tsa-downloads`.
6. Cliquez sur **Create API Token**.
7. Notez précieusement les informations générées :
   - **Access Key ID**
   - **Secret Access Key**
   - **Endpoint URL** (ex: `https://<account_id>.r2.cloudflarestorage.com`)

---

## 6. Variables d'Environnement Locales

Pour exécuter les scripts de téléversement sur votre machine de développement :

```powershell
# Dans votre profil PowerShell ou avant l'exécution du script :
$env:AWS_ACCESS_KEY_ID = "<votre_access_key_id>"
$env:AWS_SECRET_ACCESS_KEY = "<votre_secret_access_key>"
$env:R2_ENDPOINT_URL = "https://<account_id>.r2.cloudflarestorage.com"
$env:R2_BUCKET_NAME = "tsa-downloads"
```

> [!CAUTION]
> Ne commitez JAMAIS ces identifiants dans un dépôt git public ou privé. Ils doivent rester exclusivement dans vos variables d'environnement locales sécurisées ou dans les GitHub Actions Secrets si vous automatisez le téléversement.
