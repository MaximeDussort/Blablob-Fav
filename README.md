

# Favorite-Blablob!


Favorite-Blablob! est une extension pour navigateur qui aide à organiser vos favoris (bookmarks) de manière intelligente en utilisant une intelligence artificielle. L'extension classe automatiquement vos favoris dans des catégories appropriées ou crée de nouvelles catégories si nécessaire.

## Fonctionnalités

- **Organisation automatique des favoris** : Lorsqu'un nouveau favori est ajouté, l'extension utilise une IA pour déterminer la catégorie la plus appropriée.
- **Création de catégories** : Si aucune catégorie existante ne correspond, une nouvelle catégorie est créée en respectant des règles strictes pour garantir une organisation logique.
- **Interface utilisateur simple** : Une popup affiche une image et peut être utilisée pour interagir avec l'extension.
- **Support des permissions** : L'extension utilise les permissions pour accéder aux favoris et communiquer avec un serveur local.


## Description des fichiers

### Dans le fichier Firefox
- **`manifest.json`** : Fichier de configuration de l'extension, définissant les permissions, les scripts de fond et l'interface utilisateur.
- **`front/hello.html`** : Fichier HTML affiché dans la popup de l'extension.
- **`images/blablu.png`** et **`images/blablu.ico`** : Ressources graphiques utilisées dans l'extension.
- **`scripts/background.js`** : Script principal qui gère l'organisation des favoris en utilisant une API locale pour l'IA.
- **`scripts/popup.js`** : Script associé à la popup, affichant une alerte simple.
- **`README.md`** : Documentation du projet.

## Installation

1. Clonez ce dépôt sur votre machine locale.
2. Ouvrez votre navigateur et accédez à la page de gestion des extensions.
3. Activez le mode développeur.
4. Chargez l'extension en sélectionnant le dossier contenant ce projet.

## Utilisation

1. Ajoutez un nouveau favori dans votre navigateur.
2. L'extension analysera automatiquement le favori et le classera dans une catégorie appropriée.
3. Si aucune catégorie n'existe, une nouvelle sera créée.

## Dépendances

- Un serveur local doit être en cours d'exécution à l'adresse `http://127.0.0.1:11434` pour fournir les réponses de l'IA.

## Contributeurs

- **Auteur** : Maxime Dussort
![Logo de Favorite-Blablob](firefox/images/blablu.png)