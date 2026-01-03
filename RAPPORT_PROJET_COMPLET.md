# RAPPORT DE PROJET DE FIN D'ÉTUDES
## Application E-commerce "Electro-05"

---

**Auteur :** [Votre Nom]  
**Encadrant :** [Nom de l'Encadrant]  
**Année :** 2024 / 2025  
**Établissement :** [Nom de votre École/Université]

---

## 1. Introduction Générale

Le commerce électronique connaît une croissance exponentielle au Maroc, transformant les habitudes de consommation. Dans ce contexte, le projet **"Electro-05"** a été conçu pour répondre à une demande croissante d'achat de matériel informatique et électronique en ligne.

Ce projet consiste en la conception et le développement d'une application web complète (Full Stack) permettant la vente de produits High-Tech (Smartphones, PC, Gaming, Domotique). L'objectif est de fournir une expériencer utilisateur fluide, moderne et sécurisée pour les clients, tout en offrant aux administrateurs des outils puissants pour gérer le catalogue et les commandes.

---

## 2. Analyse des Besoins

### 2.1 Contexte
Les consommateurs recherchent aujourd'hui des plateformes rapides, adaptées aux mobiles et offrant une clarté sur les produits. Les solutions existantes sont souvent soit trop complexes (sur-ingénierie), soit visuellement dépassées. Electro-05 vise à combler ce vide avec une interface "Premium" et une navigation intuitive.

### 2.2 Problématique
Comment concevoir une plateforme e-commerce scalable, capable de gérer des milliers de références produits et un flux de commandes en temps réel, tout en garantissant une expérience utilisateur optimale sur tous les appareils ?

---

## 3. Cahier des Charges

### 3.1 Besoins Fonctionnels (Utilisateurs / Clients)
*   **Authentification :** Inscription, Connexion sécurisée (Token JWT).
*   **Catalogue :** Navigation par catégories (Smartphones, Gaming...), recherche textuelle, filtres (prix, marque).
*   **Achat :** Gestion du panier, tunnel de commande (Checkout), choix d'adresse.
*   **Suivi :** Historique des commandes, status de livraison, factures PDF.

### 3.2 Besoins Fonctionnels (Administrateurs)
*   **Dashboard :** Vue d'ensemble des statistiques (CA, Commandes du jour).
*   **Gestion Produits :** Ajout, modification, suppression, gestion des stocks et images.
*   **Gestion Commandes :** Changement de statut (En attente -> Livré), assignation de livreurs, annulations.
*   **Gestion Utilisateurs :** Liste des clients, bannissement éventuel.

### 3.3 Besoins Non-Fonctionnels
*   **Performance :** Chargement des pages < 2 secondes.
*   **Sécurité :** Protection contre les injections SQL, XSS, CSRF.
*   **UX/UI :** Design Responsive (Mobile First), Mode Sombre/Clair.

---

## 4. Étude Technique

Pour répondre aux exigences de performance et de scalabilité, nous avons opté pour une architecture **Headless** séparant le Frontend du Backend.

*   **Langage Backend :** PHP 8.2
*   **Framework Backend :** Laravel 10 (Architecture robuste, Eloquent ORM, Sécurité native).
*   **Langage Frontend :** JavaScript (ES6+)
*   **Framework Frontend :** React.js 18 (Composants réutilisables, Virtual DOM).
*   **Base de Données :** MySQL 8.0 (SGBD Relationnel).
*   **Style :** Tailwind CSS (Développement rapide, design system cohérent).

---

## 5. Conception et Modélisation (UML)

### 5.1 Diagramme de Cas d'Utilisation
*   **Acteur Client :** Consulter, Rechercher, S'inscrire, Commander, Payer.
*   **Acteur Admin :** S'authentifier (rôle admin), Gérer les stocks, Valider les commandes, Exporter les données.

### 5.2 Diagramme de Classes (Simplifié)
*   **User** (id, name, email, password, role)
*   **Product** (id, name, description, price, image, stock, category_id)
*   **Category** (id, name, parent_id)
*   **Order** (id, user_id, total_amount, status, created_at)
*   **OrderItem** (id, order_id, product_id, quantity, price)

---

## 6. Architecture du Système

Le projet suit une architecture **REST API** :

1.  **Client (React)** envoie une requête HTTP (ex: `GET /api/products`).
2.  **Serveur (Laravel)** reçoit la requête via le routeur `api.php`.
3.  **Controller** interroge le Modèle (M) pour récupérer les données en base.
4.  **Base de Données (MySQL)** retourne les résultats.
5.  **Serveur** renvoie une réponse JSON au Client.
6.  **Client** reçoit le JSON et met à jour l'interface utilisateur.

---

## 7. Base de Données

Le modèle relationnel (MLD) se structure autour des entités principales :

*   `users` : Table des utilisateurs.
*   `products` : Contient les informations produits et URLs d'images.
*   `categories` : Structure arborescente (catégorie mère/fille).
*   `orders` : Commandes globales.
*   `sub_orders` : Sous-commandes (pour la gestion multi-vendeurs potentielle).
*   `order_items` : Lignes de commande (pivot entre orders et products).

---

## 8. Développement

### 8.1 Backend (Laravel)
Développement des API RESTful.
*   Mise en place de l'authentification **Sanctum** (gestion des tokens Bearer).
*   Création des **Controllers** (`ProductController`, `OrderController`) pour encapsuler la logique métier.
*   Utilisation des **Seeders** pour peupler la base de données avec des produits de démonstration réalistes (Images Unsplash).

### 8.2 Frontend (React)
*   Structure modulaire : `src/components`, `src/pages`, `src/context`.
*   Gestion de l'état global avec **Context API** (AuthContext pour l'utilisateur connecté, CartContext pour le panier).
*   Intégration d'Axios pour la communication avec le backend.
*   Design "Premium" avec dégradés, ombres portées et animations fluides.

---

## 9. Tests et Validation

*   **Tests Unitaires :** Vérification des méthodes de calcul de totaux.
*   **Tests d'Intégration :** Utilisation de **Postman** pour tester tous les endpoints de l'API (codes 200, 201, 401, 404).
*   **Validation Utilisateur :** Scénarios de test complets (Création de compte -> Ajout panier -> Commande -> Vérification Admin).

---

## 10. Difficultés Rencontrées et Solutions

1.  **Gestion des Images (CORS/Storage) :**
    *   *Problème :* Les images stockées localement n'étaient pas accessibles par le frontend.
    *   *Solution :* Utilisation du lien symbolique `php artisan storage:link` et configuration correcte de l'URL dans `.env`.

2.  **État asynchrone (React) :**
    *   *Problème :* Le panier ne se mettait pas à jour immédiatement.
    *   *Solution :* Utilisation des hooks `useEffect` et restructuration du Context.

3.  **Complexité des Catégories :**
    *   *Solution :* Implémentation d'une relation récursive (parent_id) pour gérer les sous-catégories dynamiquement.

---

## 11. Conclusion et Perspectives

Le projet "Electro-05" est une réussite technique qui répond au cahier des charges initial. L'application est fonctionnelle, esthétique et performante.

### Perspectives d'évolution (V2) :
*   **Paiement en ligne :** Intégration de Stripe ou CMI.
*   **Application Mobile :** Portage du code React vers React Native.
*   **IA de recommandation :** Suggérer des produits basés sur l'historique de navigation.

---

## 12. Annexes

### A. Exemple de code (Route API)
```php
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/orders', [OrderController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
});
```

### B. Capture de l'arborescence
```
/src
  /components
    /atoms
    /molecules
    /organisms
  /pages
  /services
```
