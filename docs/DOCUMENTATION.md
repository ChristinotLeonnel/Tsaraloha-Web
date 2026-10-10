# Documentation de TSA : rédaction, aide contextuelle et publication

Ce guide s'adresse à quiconque ajoute ou modifie une page de la documentation de TSA sur ce site.

## 1. Où se trouvent les pages

Chaque page est un fichier Markdown :

```text
src/content/docs/<langue>/<catégorie>/<page>.md
```

| Élément | Valeurs |
| :--- | :--- |
| Langue | `fr` (référence, obligatoire) ou `en` (facultatif) |
| Catégorie | `getting-started`, `modeling`, `loading`, `mesh`, `analysis`, `results`, `bim`, `troubleshooting` |
| Page | minuscules et tirets ; `index` pour la page d'accueil de la catégorie |

L'adresse publique suit l'emplacement : `fr/loading/distributed-loads.md` devient `/docs/loading/distributed-loads`.
Ne renommez pas une page publiée : son adresse est utilisée par TSA et par les moteurs de recherche.

Les titres et l'ordre des catégories sont définis dans `src/docs/categories.ts`.

## 2. En-tête d'une page

```markdown
---
title: Charges réparties
description: Appliquer une charge linéique uniforme sur toute la barre ou sur une partie.
order: 4
status: available
version: 0.1.0
updated: 2026-10-10
keywords: [charge répartie, charge uniforme, udl, distributed load]
helpIds: [loading.distributed]
---
```

| Champ | Rôle |
| :--- | :--- |
| `title`, `description` | Titre et résumé, repris par la recherche et le référencement |
| `order` | Position dans la catégorie |
| `status` | `available` (disponible), `experimental` ou `planned` (prévu) |
| `version` | Version de TSA décrite |
| `updated` | Date de mise à jour, format AAAA-MM-JJ |
| `keywords` | Termes de recherche supplémentaires, séparés par des virgules (sans virgule dans un terme) |
| `helpIds` | Identifiants d'aide de TSA qui ouvrent cette page |

## 3. Syntaxe disponible

- Intertitres `##` et `###` : ils alimentent le sommaire de la page. Le titre `#` est inutile.
- Listes, tableaux, code en ligne, blocs de code, gras, italique.
- Encadrés : `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!IMPORTANT]` sur la première ligne de la citation.
- Liens internes absolus (`/docs/modeling/nodes`) ou externes en HTTPS. Les autres liens sont refusés.

Aucun HTML n'est interprété : le contenu est rendu en éléments React.

## 4. Règles de contenu

- Ne décrire que ce que TSA fait réellement, et indiquer l'état de chaque fonction.
- Ne pas inventer de lien de téléchargement, de prix ou de licence.
- Pas de traduction automatique non relue : sans page `en`, le site affiche la page française avec un avis.

## 5. Aide contextuelle de TSA

Les boutons Aide de TSA ouvrent une page par un identifiant stable, par exemple `loading.distributed`.

1. La table des identifiants est dans le dépôt TSA : `src/Help/HelpTopics.cpp`.
2. La page cible déclare le même identifiant dans `helpIds`.
3. L'adresse de base est `kDocsBaseUrl` dans `product/ProductIdentity.h` de TSA. Elle doit être identique à `siteUrl` dans `src/config/deployment.json`.

TSA n'envoie que la langue (`?lang=fr`) et sa version (`&v=0.1.0`). Un identifiant inconnu ouvre `/docs`.

Pour ajouter un identifiant : ajouter la ligne dans `HelpTopics.cpp`, ajouter l'identifiant dans `helpIds`,
puis lancer `npm run check:docs` avec le dépôt TSA placé à côté de ce dépôt (`../TSA`).

## 6. Vérifier

```bash
npm run check:docs   # en-têtes, pages vides, liens internes, identifiants d'aide (et registre de TSA s'il est présent)
npm run build        # vérification, compilation, une page HTML par route, sitemap.xml
npm run test:docs    # catalogue, recherche, sûreté du rendu, pages de route
npm run preview      # aperçu local
```

Pour un aperçu identique à GitHub Pages, construire avec la base du dépôt :

```bash
VITE_BASE_PATH=/Tsaraloha-Web/ npm run build
VITE_BASE_PATH=/Tsaraloha-Web/ npm run preview
```

Sous Git Bash, préfixer ces commandes par `MSYS_NO_PATHCONV=1`.

## 7. Publier

1. Fusionner la branche dans `main`.
2. Pousser `main` : le flux `.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages.
3. Dans les réglages du dépôt, **Pages** doit avoir la source « GitHub Actions ».
4. Vérifier ensuite quelques adresses directes, par exemple `/docs/loading/distributed-loads`.

Une construction échoue si `check:docs` trouve une erreur : aucune page cassée n'est publiée.
