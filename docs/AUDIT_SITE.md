# Audit du site TSA / TSALab — 17/10/2026

Audit préalable à la refonte (mission « Refonte et amélioration complète des sites TSA et TSALab »). Chaque constat
renvoie à ce qui a été vérifié : code du site, code des logiciels (`../TSA`, `../TSALab`), API publique de GitHub.

## 1. Architecture actuelle (conservée)

| Élément | État constaté |
| :--- | :--- |
| Pile | Vite 8, React 19, TypeScript 6, Tailwind CSS 4, icônes Lucide ; aucune dépendance serveur |
| Hébergement | GitHub Pages (`https://christinotleonnel.github.io/Tsaraloha-Web/`, HTTP 200), flux `.github/workflows/deploy.yml` sur `main` |
| Routage | routeur maison compatible avec le sous-chemin de GitHub Pages ; `404.html` de repli |
| Prérendu | `scripts/prerender-routes.mjs` : une copie de `index.html` par route (titre, description, canonique), `sitemap.xml` ; le contenu est rendu côté client |
| Documentation | pages Markdown (`src/content/docs/<langue>/<catégorie>/<page>.md`), en-tête (statut, version, date, mots-clés, identifiants d'aide de TSA), recherche, sommaire, encadrés, rendu sans HTML ; contrôles `check:docs` et `test:docs` |
| Langues | français (référence) et anglais (interface ; documentation en repli sur le français avec avis) |
| État de référence | build réussi (72 pages de route, sitemap de 73 adresses), `test:docs` 45/45, lint : 5 avertissements, aucune erreur |

Le générateur documentaire existant est adapté (contenu séparé, versions, statut, aide contextuelle de TSA) : il est
**étendu** à TSALab plutôt que remplacé.

## 2. Faits vérifiés côté logiciels

| Sujet | Constat (source) |
| :--- | :--- |
| Versions | TSA 0.1.0 et TSALab 0.1.0 (`product/ProductIdentity.h`) |
| Dépôts | `Tsaraloha-Structural-Analysis` et `Tsaraloha-Structural-Analysis-Virtual-Laboratory` **publics** ; **aucune GitHub Release**, **aucun workflow**, **aucun fichier de licence** (API GitHub) |
| Distribution | dossier portable Windows x64 produit par `package_TSA` / `package_TSALab`, `MANIFEST.json` (SHA-256 de chaque fichier), contrôle `tools/verify_package.py` ; pas d'installateur, pas de signature de code (`TSA/docs/DEPLOYMENT.md`) |
| Licences tierces | Qt (LGPL v3), OCCT (LGPL 2.1 + exception), **OpenSees** (usage éducatif, de recherche et non lucratif ; usage commercial soumis à accord), **Gmsh** (GPL, livré) : la diffusion publique de binaires exige une décision de licence de l'auteur |
| Analyses de TSA | statique linéaire, statique non linéaire (P-Delta, contrôle en déplacement), **modale** (OpenSees, `AnalysisDialog`, `supportsModal`) ; pas de temporel ni de pushover dans l'interface |
| Banc de validation | 28 cas, 146 vérifications réussies le 12/10/2026 (`TSA/docs/BENCHMARKS.md`) |
| Commandes | catalogue central (`CommandCatalog.cpp`), référence générée `docs/shortcut.txt` (catégorie, identifiant, raccourci, libellé, description), emplacement dans le ruban (`RibbonBuilder.cpp` + `MainWindow_Shortcuts.cpp`) |
| TSALab | 27/27 tests (L4 à L30), science 22/22, essai de l'interface réelle 28/28 (`TSALab/docs/AUDIT_FONCTIONNALITES.md`) |

## 3. Problèmes identifiés

| N° | Gravité | Problème |
| :--- | :--- | :--- |
| P1 | haute | TSALab n'est présenté nulle part (ni page, ni documentation, ni téléchargement) |
| P2 | haute | Téléchargements : aucune version publiée, bouton vers la page générale des Releases, configuration « minimale / recommandée » non mesurée (i7/i9, 16 à 32 Go, 15 Go NVMe…), Linux annoncé sans base dans le code, dépendances fausses (OCCT 7.7+ au lieu de 8.0.1, CMake 3.25+ au lieu de 3.20) |
| P3 | haute | Page Prix : éditions commerciales et fonctions non vérifiées (vérifications AISC, rotules plastiques, « le plus populaire », liste d'attente) |
| P4 | haute | Catalogue des fonctionnalités à revérifier une à une (ex. « 27 cas / 144 vérifications » au lieu de 28 / 146, combinaisons « automatisées selon l'Eurocode 0 », dynamique) |
| P5 | haute | Aucun processus de publication (script, workflow, empreintes, notes) ; aucun téléchargement direct possible |
| P6 | haute | Retours : un seul formulaire (contact) ; pas de signalement de bug, d'amélioration, d'erreur documentaire ni d'avis ; pas de modèles de tickets dans les dépôts des logiciels |
| P7 | moyenne | Pas de référence des commandes, pas de tutoriels à résultats vérifiés ni de fichiers de projet associés ; page d'installation au statut « prévu » |
| P8 | moyenne | Documentation : pas de statut « obsolète », pas de lien « signaler une erreur » par page, version unique (TSA) |
| P9 | moyenne | Pas de pages Confidentialité, Mentions légales, Contact distinct, Versions / comparaison, Retours |
| P10 | moyenne | Performance : un seul paquet JavaScript de 577 Ko ; fichier audio WAV de 8 Mo dans `public/` |
| P11 | basse | Assistant IA : dialogue scénarisé (annoncé comme simulation) au lieu des outils réels de TSA |
| P12 | basse | Lint : 5 avertissements (exports mixtes, `setState` dans un effet) |

## 4. Plan d'exécution

1. **Données vérifiées et générées** : commandes de TSA (catalogue, raccourcis, emplacement dans le ruban, icônes),
   versions publiées (API GitHub au moment de la construction, validées), tutoriels de TSA tirés du banc de validation
   (projets `.tsa` exportés par l'outil du banc, résultats calculés), expériences de TSALab (fichiers `.tsalab` / `.tsbp`
   exportés, résultats d'exécution). Les fichiers générés sont versionnés : la construction du site n'a pas besoin des
   dépôts des logiciels.
2. **Architecture du site** : rubriques TSA et TSALab distinctes, centre de documentation à deux produits (adresses
   de TSA inchangées, utilisées par l'aide du logiciel), tutoriels, téléchargements par produit, versions et
   comparaison, feuille de route et actualités, retours (4 formulaires), contact, confidentialité, mentions légales.
3. **Publication** : scripts reproductibles dans chaque dépôt logiciel (tests, compilation Release, paquet, contrôle,
   archive, SHA-256, notes, brouillon de Release puis publication explicite), flux GitHub Actions sur exécuteur Windows
   auto-hébergé (les dépendances — Qt 6.11.2, OCCT 8.0.1, Gmsh, OpenSees — ne sont pas disponibles sur les exécuteurs
   hébergés), vérification des empreintes après publication, reconstruction du site.
4. **Retours** : modèles de tickets (formulaires GitHub) dans les dépôts, formulaires du site qui les pré-remplissent ;
   service d'envoi sans compte GitHub (fonction serveur, jeton côté serveur, validation, anti-abus) utilisé dès qu'il est
   déployé ; aucun message de succès sans enregistrement réel.
5. **Qualité** : accessibilité, responsive, réduction des animations, référencement, découpage du JavaScript,
   en-têtes de sécurité possibles sur GitHub Pages (CSP en balise meta), tests automatisés, audit visuel, déploiement.
