# Dossier d'Architecture Technique - Projet Electro-05

## 1. Présentation Générale du Projet

**Nom du projet :** Electro-05  
**Type :** Plateforme E-commerce High-Tech (B2C)  
**Objectif :** Fournir une application web moderne, performante et responsive pour la vente de produits électroniques (Smartphones, PC, Gaming, etc.) au Maroc. L'application gère le catalogue produits, le panier, les commandes, le suivi de livraison et une interface d'administration complète.

---

## 2. Architecture Globale

Le projet repose sur une architecture **Client-Serveur (Headless)** découplée :

*   **Frontend (Client) :** Une Single Page Application (SPA) développée avec **React.js**. Elle communique avec le serveur via des requêtes HTTP asynchrones (AJAX/Fetch).
*   **Backend (Serveur) :** Une API RESTful développée avec **Laravel (PHP)**. Elle traite la logique métier, sécurise les données et interagit avec la base de données.
*   **Base de Données :** **MySQL** relationnelle pour le stockage persistant des données.

### Schéma d'interaction
```mermaid
[Client : React SPA]  <-- JSON / HTTPS -->  [API Gateway : Laravel]  <-->  [Base de Données : MySQL]
       |                                          |
   (Navigateur)                            (Serveur Web / PHP)
```

---

## 3. Description des Couches

### A. Couche Présentation (Frontend)
Cette couche gère l'interface utilisateur (UI) et l'expérience utilisateur (UX).
*   **Composants :** Architecture atomique (Atoms, Molecules, Organisms, Templates).
*   **Routing :** Gestion de la navigation côté client via `react-router-dom`.
*   **État Global :** Utilisation de `Context API` pour gérer l'authentification (`AuthContext`), le panier (`CartContext`) et les préférences (`ThemeContext`).

### B. Couche Application (Backend - API)
Cette couche expose les endpoints consommés par le frontend.
*   **Routing API :** Définition des routes dans `routes/api.php` (ex: `/api/products`, `/api/orders`).
*   **Middleware :** Interception des requêtes pour la sécurité (CORS, Authentification `auth:sanctum`, vérification Admin).

### C. Couche Métier (Business Logic)
Contient les règles de gestion.
*   **Controllers :** Orchestrent les requêtes (ex: `ProductController`, `OrderController`).
*   **Services :** Logique complexe (ex: génération de facture PDF, envoi d'emails).

### D. Couche Accès aux Données (Persistence)
*   **ORM (Object-Relational Mapping) :** Utilisation d'Eloquent pour manipuler la base de données sans écrire de SQL brut.
*   **Models :** Représentation des tables (User, Product, Order).

---

## 4. Pattern Architectural : MVC (Modèle-Vue-Contrôleur)

Bien que le projet soit une API (donc sans "Vue" au sens HTML serveur), le backend respecte le pattern MVC adapté :

1.  **Modèle (Model) :**
    *   Fichiers : `app/Models/` (Product.php, Order.php...)
    *   Rôle : Structure les données et les relations (ex: Une Commande *appartient à* un Utilisateur).

2.  **Vue (View) :**
    *   Rôle : Délégué entièrement au Frontend React (JSON Response). Le backend renvoie des données brutes, c'est React qui construit le HTML.

3.  **Contrôleur (Controller) :**
    *   Fichiers : `app/Http/Controllers/`
    *   Rôle : Reçoit la requête, interroge le Modèle, applique les règles métier, et retourne la réponse JSON.

---

## 5. Structure des Dossiers du Projet

### Frontend (`Frond-end/test/src/`)
```
src/
├── components/          # Blocs de construction UI
│   ├── atoms/           # Boutons, Inputs, Loader
│   ├── molecules/       # Cartes Produit, Champs de recherche
│   └── organisms/       # Navbar, Footer, Sidebar Filtres, grilles
├── context/             # États partagés (Auth, Cart, Language)
├── layouts/             # Squelettes de pages (MainLayout, AdminLayout)
├── pages/               # Vues principales (Home, Shop, AdminDashboard)
├── services/            # Appels API (api.js, image.js)
└── App.js               # Point d'entrée et Routing
```

### Backend (`05-Electro-Back-end/`)
```
app/
├── Http/
│   ├── Controllers/     # Logique des endpoints (API)
│   └── Middleware/      # Sécurité (AdminMiddleware)
├── Models/              # Classes Eloquent (ORM)
config/                  # Configuration (cors.php, database.php)
database/
├── migrations/          # Schémas des tables SQL
└── seeders/             # Données de test (DatabaseSeeder)
routes/
└── api.php              # Définition des routes API
storage/                 # Stockage des fichiers (Images produits, Factures)
```

---

## 6. Diagrammes UML (Description)

### A. Diagramme de Classes (Entités Principales)
*   **User :** (id, name, email, role: 'admin'|'customer')
*   **Product :** (id, name, price, stock, category_id)
*   **Category :** (id, name, parent_id) -> *Structure récursive*
*   **Order :** (id, user_id, total_amount, status)
*   **OrderItem :** (id, order_id, product_id, quantity, price)
*   **Relations :**
    *   User `1--*` Order (Un utilisateur passe plusieurs commandes)
    *   Category `1--*` Product (Une catégorie contient plusieurs produits)
    *   Order `1--*` OrderItem (Une commande contient plusieurs lignes)

### B. Diagramme de Séquence : "Passer une Commande"
1.  **Client (React)** : L'utilisateur clique sur "Commander".
2.  **Client** : Envoie une requête `POST /api/orders` avec le payload (items, adresse).
3.  **API (Laravel Route)** : Redirige vers `OrderController@store`.
4.  **Controller** :
    *   Vérifie le stock des Produits via le **Model Product**.
    *   Crée l'entrée dans la table `orders`.
    *   Crée les lignes dans `order_items`.
    *   Décrémente le stock.
5.  **Database** : Confirme la transaction.
6.  **Controller** : Retourne un JSON `201 Created` avec l'ID de commande.
7.  **Client** : Affiche la page "Commande validée" et vide le panier (Context).

---

## 7. Technologies Utilisées et Justification

### Frontend
*   **React.js (v18+) :** Pour une interface utilisateur réactive (SPA) et modulaire.
*   **Tailwind CSS :** Pour un design rapide, responsive et moderne sans écrire de CSS classique.
*   **Axios :** Pour simplifier les requêtes HTTP et la gestion des intercepteurs (Tokens).
*   **Framer Motion / GSAP :** (Optionnel) Pour les animations fluides et l'aspect "Premium".

### Backend
*   **Laravel (v10+) :** Framework PHP robuste, sécurisé par défaut, avec un excellent ORM (Eloquent).
*   **Laravel Sanctum :** Système léger d'authentification par Token (SPA Auth).
*   **MySQL :** SGBD fiable pour gérer les relations complexes et les transactions.

### Outils
*   **Git :** Versionning.
*   **Postman / ThunderClient :** Test des API.
*   **Composer / NPM :** Gestionnaires de dépendances.

---

## 8. Sécurité, Performance et Évolutivité

### Sécurité
*   **Authentification :** Tokens Bearer via Sanctum. Protection des routes `/admin` via Middleware.
*   **Protection CSRF/XSS :** Gérée nativement par Laravel (sanitization des entrées).
*   **Validation :** Validation stricte des données entrantes (`Request $request->validate()`).

### Performance
*   **Lazy Loading (React) :** Chargement différé des images et des composants de page (Code Splitting) pour accélérer l'affichage initial.
*   **Eager Loading (Laravel) :** Utilisation de `with('category')` pour éviter le problème "N+1 query".
*   **Optimisation Assets :** Images compressées (WebP) stockées dans `storage/public`.

### Évolutivité
L'architecture découplée permet de :
*   Changer le Frontend sans toucher au Backend (ex: créer une App Mobile native qui consomme la même API).
*   Mettre à l'échelle la base de données indépendamment du serveur d'application.
