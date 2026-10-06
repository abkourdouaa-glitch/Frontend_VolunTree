VolunTree - Frontend

Interface web de VolunTree, une plateforme de gestion de bénévolat qui met en relation des bénévoles et des associations. Projet de fin d'études (PFE) du diplôme Développement Digital, option Web Full Stack (OFPPT).

Ce dépôt contient le frontend (React.js). Le backend (API Laravel) est ici : https://github.com/abkourdouaa-glitch/Backend_VolunTree
Fonctionnalités

Côté bénévole

Inscription, connexion et gestion du profil (avec photo)
Consultation des missions avec recherche et filtres
Candidature à une mission et suivi de l'état des candidatures
Téléchargement du Pass Bénévole en PDF

Côté association

Création, modification et suppression de missions (CRUD)
Consultation des candidatures reçues, avec acceptation ou refus
Tableau de bord avec statistiques

Général

Deux rôles (bénévole / association) avec tableaux de bord dédiés
Routes protégées selon le rôle (ProtectedRoute)
Interface moderne et responsive
Technologies
React.js
Tailwind CSS
Axios pour les appels à l'API
Authentification par token (Laravel Sanctum côté backend

Installation
# 1. Cloner le dépôt
git clone https://github.com/abkourdouaa-glitch/Frontend_VolunTree.git
cd Frontend_VolunTree

# 2. Installer les dépendances
npm install

# 3. Lancer l'application en développement
npm run dev
