---
title: Installation
description: Comment télécharger et installer Tsaraloha Structural Analysis sous Windows.
order: 3
status: available
version: 0.1.0
updated: 2026-10-20
keywords: [installer, télécharger, setup, install, download, windows]
helpIds: []
---
## Téléchargement officiel

Le logiciel TSA est disponible sous forme d'un installateur Windows autonome sur la page
[Télécharger TSA](/downloads/tsa).

> [!IMPORTANT]
> Téléchargez exclusivement TSA depuis le site officiel ou son stockage direct certifié. Aucun compte tiers ni environnement de développement (Visual Studio, CMake) n'est nécessaire.

## Procédure d'installation

1. Téléchargez le fichier officiel `TSA-0.1.0-windows-x64-setup.exe`.
2. *(Recommandé)* Vérifiez l'empreinte de sécurité SHA-256 avec PowerShell pour confirmer l'intégrité du fichier.
3. Exécutez l'installateur et suivez les étapes de l'assistant de Tsaraloha Software.
4. Choisissez le répertoire d'installation (par défaut `C:\Program Files\Tsaraloha Software\TSA` ou le dossier utilisateur local).
5. L'assistant associe automatiquement l'extension de projet `.tsa` et crée les raccourcis sur le Bureau et dans le menu Démarrer.

## Après l'installation

1. Lancez TSA depuis le menu Démarrer ou le Bureau.
2. Créez un nouveau modèle ou ouvrez un fichier `.tsa` d'exemple.
3. Les moteurs de calcul (OpenCASCADE, OpenSees, Gmsh) sont immédiatement opérationnels sans configuration supplémentaire.

## Voir aussi

- [Configuration requise](/docs/getting-started/system-requirements)
- [Créer un projet](/docs/getting-started/create-project)
