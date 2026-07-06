# 📦 Electro-05 — Documentation Complète du Projet
### E-Commerce d'Appareils Électroniques — Architecture Headless Dockerisée

---

## 🗂️ TABLE DES MATIÈRES

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Architecture du système](#2-architecture-du-système)
3. [Modules fonctionnels](#3-modules-fonctionnels)
4. [Base de données](#4-base-de-données)
5. [API REST](#5-api-rest)
6. [Frontend React](#6-frontend-react)
7. [Infrastructure Docker](#7-infrastructure-docker)
8. [Sécurité](#8-sécurité)
9. [Installation & Déploiement](#9-installation--déploiement)
10. [Défis & Solutions](#10-défis--solutions)
11. [Améliorations futures](#11-améliorations-futures)

---

## 1. Vue d'ensemble du projet

**Electro-05** est une plateforme e-commerce complète pour la vente d'appareils électroniques professionnels sur le marché marocain. L'application suit une **architecture Headless** où le frontend React est totalement découplé du backend Laravel via une API REST, le tout conteneurisé avec Docker.

### Technologies

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Frontend** | React.js (SPA) | 19 |
| **Styling** | Tailwind CSS, SCSS | – |
| **Animations** | GSAP, Three.js | – |
| **Internationalisation** | i18next | fr, en, ar, es |
| **Backend** | Laravel | 12 |
| **Authentification** | Laravel Sanctum | Bearer tokens |
| **Base de données** | MySQL | 8.0 |
| **Cache / Queue** | Redis | 7 |
| **Reverse proxy** | Nginx | 1.25 |
| **Conteneurisation** | Docker Compose | V5 |
| **PDF** | DomPDF | – |
| **Export** | Maatwebsite Laravel Excel | – |

### Objectifs

- ✅ Créer une plateforme e-commerce complète et moderne
- ✅ Simplifier l'expérience d'achat : recherche rapide, panier intuitif, commande en quelques clics
- ✅ Donner aux administrateurs un outil de gestion complet (produits, commandes, statistiques)
- ✅ Appliquer les bonnes pratiques Full-Stack (API REST, Docker, CI-ready)
- ✅ Architecture scalable, déployable en production

---

## 2. Architecture du système

### Architecture globale (3 tiers + Docker)

```
┌──────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │               FRONTEND  (React 19 SPA)                  │  │
│  │  - 30 pages (React.lazy + Suspense)                    │  │
│  │  - 6 Contextes (Auth, Cart, Compare, Theme, Lang, Wish)│  │
│  │  - GSAP animations, Three.js 3D                        │  │
│  │  - i18n 4 langues (fr/en/ar/es)                       │  │
│  └──────────────────────┬─────────────────────────────────┘  │
└─────────────────────────│────────────────────────────────────┘
                          │ HTTP :8080
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                   NGINX (Reverse Proxy)                       │
│  /api/* → fastcgi_pass laravel:9000                         │
│  /*     → proxy_pass react:3000                              │
│  /storage/* → alias vers laravel-storage                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│   Laravel    │ │  Queue   │ │Scheduler │
│   PHP-FPM    │ │  Worker  │ │          │
│   :9000      │ │          │ │          │
└──────┬───────┘ └──────────┘ └──────────┘
       │
       ├────────── MySQL 8.0 ──────────┐
       └────────── Redis 7 ────────────┘
```

### Schéma réseau Docker

```
electro_frontend (bridge)      electro_backend (bridge)
┌─────────────────────┐       ┌──────────────────────────────┐
│  nginx ←→ react     │       │  nginx ←→ laravel           │
└─────────────────────┘       │  laravel ←→ mysql           │
                              │  laravel ←→ redis           │
                              │  queue ←→ redis             │
                              │  phpmyadmin ←→ mysql        │
                              │  mailpit ←→ laravel         │
                              │  scheduler → laravel        │
                              └──────────────────────────────┘
```

### Principe de fonctionnement

1. **React SPA** sert l'interface utilisateur (port 3000)
2. **Nginx** (port 8080) agit comme unique point d'entrée
3. Les routes `/api/*` sont proxyfiées en FastCGI vers **Laravel PHP-FPM** (port 9000)
4. Les routes statiques servent le build React
5. Les fichiers `/storage/*` sont servis directement depuis le volume Laravel
6. **MySQL** stocke les données persistantes
7. **Redis** gère cache, sessions et files d'attente
8. **Queue Worker** traite les tâches asynchrones (envoi d'emails, etc.)
9. **Scheduler** exécute les tâches planifiées Laravel
10. **Mailpit** capture les emails en dev ; **phpMyAdmin** gère la BDD

**Avantage clé :** zéro CORS — un seul origin (http://localhost:8080) sert à la fois le frontend et l'API.

---

## 3. Modules fonctionnels

### Module 1 : Authentification & Utilisateurs

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/register` | throttle:3 | Inscription avec envoi OTP |
| POST | `/api/login` | throttle:5 | Connexion email + password |
| POST | `/api/auth/google` | – | Connexion Google OAuth |
| POST | `/api/auth/magic-link` | – | Envoi lien magique |
| POST | `/api/auth/magic-verify` | – | Vérification lien magique |
| POST | `/api/otp/send-verification` | – | Renvoi code OTP |
| POST | `/api/otp/verify-email` | – | Validation email + token |
| POST | `/api/otp/send-reset` | – | OTP réinitialisation password |
| POST | `/api/otp/reset-password` | – | Reset password avec OTP |
| GET | `/api/user` | Sanctum | Profil utilisateur |
| PUT | `/api/user` | Sanctum | Mise à jour profil |
| POST | `/api/user/change-password` | Sanctum | Changement mot de passe |
| POST | `/api/logout` | Sanctum | Déconnexion (révocation token) |
| GET | `/api/admin/users` | Sanctum + admin | Liste utilisateurs |

**Workflow inscription :**
1. Client soumet `POST /api/register` (name, email, password)
2. API crée user (role=customer, email_verified=false)
3. API envoie email OTP à 6 chiffres
4. Client soumet OTP via `POST /api/otp/verify-email`
5. API marque email_verified=true, retourne token Bearer

### Module 2 : Catalogue & Produits

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | `/api/products` | – | Catalogue (filtres, pagination, tri) |
| GET | `/api/products/{id}` | – | Détail produit |
| GET | `/api/categories` | – | Arborescence catégories |
| GET | `/api/categories/{id}` | – | Catégorie + enfants + produits |
| POST | `/api/products` | Sanctum + admin | Création produit |
| PUT | `/api/products/{id}` | Sanctum + admin | Modification produit |
| DELETE | `/api/products/{id}` | Sanctum + admin | Suppression produit |
| GET | `/api/admin/products/export` | Sanctum + admin | Export CSV/XLSX |
| GET | `/api/products/{id}/reviews` | – | Avis approuvés |
| POST | `/api/products/{id}/reviews` | Sanctum + verified | Soumettre avis |
| PATCH | `/api/admin/reviews/{id}/approve` | Sanctum + admin | Modérer avis |
| GET | `/api/admin/reviews` | Sanctum + admin | Tous les avis |
| GET | `/api/wishlist` | Sanctum + verified | Wishlist |
| POST | `/api/wishlist/toggle` | Sanctum + verified | Ajouter/retirer wishlist |
| DELETE | `/api/wishlist/{productId}` | Sanctum + verified | Supprimer wishlist |
| DELETE | `/api/wishlist` | Sanctum + verified | Vider wishlist |
| GET | `/api/wishlist/ids` | Sanctum + verified | IDs wishlist uniquement |

**Filtres catalogue :**
- `category_id` : Filtre par catégorie (récursif : inclut sous-catégories)
- `search` : Recherche textuelle dans le nom
- `price_min` / `price_max` : Filtre par intervalle de prix
- `state` : neuf / occasion / reconditionne
- `brand` : Filtre par marque
- `promo` : Uniquement produits en promotion
- `is_featured` : Produits à la une
- `in_stock` : Uniquement produits en stock

### Module 3 : Panier, Commande & Paiement

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/orders` | – | Créer commande (guest autorisé) |
| GET | `/api/orders/{id}` | – | Détail commande (token sécurisé) |
| GET | `/api/my-orders` | Sanctum + verified | Commandes utilisateur |
| POST | `/api/orders/{id}/pay` | Sanctum | Paiement virtuel CB |
| GET | `/api/orders/{id}/receipt` | – | Reçu PDF |
| GET | `/api/invoice/{id}` | – | Facture HTML/PDF |
| PATCH | `/api/admin/orders/{id}/status` | Sanctum + admin | Màj statut |
| PATCH | `/api/admin/orders/{id}/assign` | Sanctum + admin | Assigner agent |
| PATCH | `/api/admin/orders/{id}/payment` | Sanctum + admin | Màj paiement |
| POST | `/api/admin/orders/{id}/refund` | Sanctum + admin | Remboursement |
| GET | `/api/admin/orders/export` | Sanctum + admin | Export CSV/XLSX |
| POST | `/api/admin/orders/{id}/resend-invoice` | Sanctum + admin | Renvoi facture |

**Workflow commande :**
1. Client remplit le checkout (adresse, téléphone, ville, notes)
2. `POST /api/orders` avec items du panier (panier envoyé depuis le frontend)
3. API valide les données, vérifie les prix en base (pas de confiance client)
4. API crée Order, puis OrderItems, puis SubOrders (découpage par seller)
5. API déduit le stock de chaque produit
6. API génère secure_token (64 caractères hex) pour suivi sans auth
7. API envoie email confirmation au client + notification à l'admin
8. Réponse 201 avec les détails de la commande

**Paiement virtuel :**
- Validation carte 16 chiffres (algorithme de Luhn disponible)
- Date d'expiration non dépassée
- CVV 3-4 chiffres
- Mise à jour payment_status → "paid"
- Génération reçu PDF via DomPDF

### Module 4 : Dashboard Administration

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard : KPIs, graphiques, tendances |
| GET | `/api/admin/orders` | Liste toutes commandes avec filtres |
| GET | `/api/admin/products/export` | Export produits CSV/XLSX |
| GET | `/api/admin/orders/export` | Export commandes CSV/XLSX |
| DELETE | `/api/reviews/{id}` | Supprimer son avis |
| GET | `/api/brands` | Liste marques |

**Dashboard KPIs :**
- Commandes totales, Revenu total, Produits, Utilisateurs, Avis
- Commandes aujourd'hui, en retard, en attente, en cours
- Produits faibles stocks, ruptures de stock
- Revenus 30 jours (barres, jours sans trous)
- Répartition paiements (paid/unpaid/refunded)
- Statuts commandes (camembert)
- Top 10 produits vendus
- Nouveaux utilisateurs (30 jours)
- Top 10 villes clientes
- Activité récente (logs)
- Revenu mensuel vs mois précédent (avec % croissance)

### Module 5 : Support & Informations

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/contact` | throttle:3 | Envoyer message |
| GET | `/api/locations` | – | Liste agences/relais |
| GET | (frontend) | – | FAQ, CGV, Retours, Promotions |

**Pages informatives :**
- `/faq` — Foire aux questions
- `/conditions` — Conditions générales de vente
- `/retours` — Politique de retours
- `/promotions` — Offres promotionnelles
- `/support` — Centre d'aide avec assistant intelligent
- `/contact` — Formulaire de contact + carte interactive
- `/track/:id` — Suivi commande par token

---

## 4. Base de données

### 4.1 Schéma relationnel

```
┌───────────────┐     ┌─────────────────┐     ┌──────────────────┐
│    users      │     │   categories    │     │    products      │
├───────────────┤     ├─────────────────┤     ├──────────────────┤
│ id (PK)       │     │ id (PK)         │     │ id (PK)          │
│ name          │     │ name            │     │ name             │
│ email (UQ)    │     │ slug (UQ)       │     │ slug (UQ)        │
│ password      │     │ image           │     │ description      │
│ role          │     │ parent_id (FK)──┼──┐  │ price            │
│ google_id (UQ)│     └─────────────────┘  │  │ old_price        │
│ email_verified│          │               │  │ image            │
│ phone         │          │               │  │ images (JSON)    │
│ city          │          ▼               │  │ stock            │
│ address       │     ┌────────────┐       │  │ state            │
│ avatar        │     │ categories │       │  │ promo            │
│ created_at    │     │ (enfants)  │       │  │ is_featured      │
└───────┬───────┘     └────────────┘       │  │ delivery_type    │
        │                                  │  │ category_id (FK)─┘
        │  ┌──────────────────┐            │  │ seller_id (FK)───┐
        ├──│ activity_logs    │            │  └──────────────────┘
        │  ├──────────────────┤            │           │
        │  │ id (PK)          │            │           │
        │  │ user_id (FK)     │            │           ▼
        │  │ action           │     ┌──────────────┐
        │  │ target_type      │     │   sellers    │
        │  │ target_id        │     ├──────────────┤
        │  │ details          │     │ id (PK)      │
        │  │ ip_address       │     │ name         │
        │  └──────────────────┘     │ city         │
        │                          │ email        │
        │  ┌──────────────┐        │ logo         │
        ├──│ wishlists    │        │ prep_days    │
        │  ├──────────────┤        └──────┬───────┘
        │  │ id (PK)      │              │
        │  │ user_id (FK) │              │
        │  │ product_id(FK)              │
        │  └──────────────┘              │
        │                               │
        │  ┌──────────────┐     ┌───────┴────────┐
        ├──│ reviews      │     │   sub_orders   │
        │  ├──────────────┤     ├────────────────┤
        │  │ id (PK)      │     │ id (PK)        │
        │  │ product_id   │     │ order_id (FK)  │
        │  │ user_id (FK) │     │ seller_id (FK)─┘
        │  │ rating       │     │ subtotal       │
        │  │ approved     │     │ status         │
        │  └──────────────┘     │ delivery_est.  │
        │                       └───────┬────────┘
        │                               │
        │  ┌──────────────────┐         │
        ├──│ orders           │         │
        │  ├──────────────────┤         │
        │  │ id (PK)          │         │
        │  │ customer_name    │         │
        │  │ customer_email   │         │
        │  │ customer_phone   │         │
        │  │ customer_address │         │
        │  │ customer_city    │         │
        │  │ total_amount     │         │
        │  │ status           │         │
        │  │ secure_token(UQ) │         │
        │  │ payment_method   │         │
        │  │ payment_status   │         │
        │  │ assigned_agent   │         │
        │  │ refunded_amount  │         │
        │  └────────┬─────────┘         │
        │           │                   │
        │           ▼                   ▼
        │  ┌──────────────────────────────────┐
        └──│          order_items             │
           ├──────────────────────────────────┤
           │ id (PK)                          │
           │ order_id (FK) ───────────────────┤
           │ product_id (FK)                  │
           │ sub_order_id (FK) ───────────────┘
           │ quantity                         │
           │ price                            │
           └──────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    otps      │     │  magic_links │     │  locations   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │     │ id (PK)      │     │ id (PK)      │
│ email        │     │ email        │     │ name         │
│ code (6)     │     │ token (UQ)   │     │ city         │
│ type         │     │ expires_at   │     │ address      │
│ used         │     │ used_at      │     │ latitude     │
│ expires_at   │     └──────────────┘     │ longitude    │
└──────────────┘                          │ type         │
                                          └──────────────┘
```

### 4.2 Tables système (Laravel)
- `personal_access_tokens` — Tokens Sanctum
- `password_reset_tokens` — Reset password
- `sessions` — Sessions PHP
- `cache`, `cache_locks` — Cache Laravel
- `jobs`, `job_batches`, `failed_jobs` — Queue

### 4.3 Relations principales
- `users` 1→* `orders` : Un utilisateur peut avoir plusieurs commandes
- `users` 1→* `reviews` : Un utilisateur peut laisser plusieurs avis
- `users` 1→* `wishlists` : Un utilisateur a une wishlist
- `categories` 1→* `categories` : Auto-référence parent/enfant
- `categories` 1→* `products` : Une catégorie contient plusieurs produits
- `products` *→1 `sellers` : Un produit appartient à un vendeur
- `orders` 1→* `order_items` : Une commande contient plusieurs articles
- `orders` 1→* `sub_orders` : Une commande se divise en sous-commandes
- `sub_orders` 1→* `order_items` : Une sous-commande regroupe ses articles
- `sellers` 1→* `sub_orders` : Un vendeur a des sous-commandes

---

## 5. API REST

### 5.1 Convention
- **Base URL :** `http://localhost:8080/api`
- **Format :** JSON (request et response)
- **Auth :** `Authorization: Bearer {token}` (Sanctum)
- **Pagination :** `?page=N` (12 items/page)
- **Locale :** `Accept-Language: fr|en|ar|es`
- **Rate limiting :** Headers `X-RateLimit-*`

### 5.2 Tous les endpoints

#### Public
```
POST   /api/register                     # Inscription
POST   /api/login                        # Connexion
POST   /api/auth/magic-link              # Demande magic link
POST   /api/auth/magic-verify            # Vérification magic link
POST   /api/auth/google                  # Google OAuth
POST   /api/otp/send-verification        # Envoi OTP email
POST   /api/otp/verify-email             # Vérification OTP
POST   /api/otp/send-reset              # OTP reset password
POST   /api/otp/reset-password          # Reset password
GET    /api/products                     # Catalogue (filtres)
GET    /api/products/{id}               # Détail produit
GET    /api/products/{id}/reviews       # Avis approuvés
GET    /api/categories                   # Arborescence catégories
GET    /api/categories/{id}             # Catégorie spécifique
GET    /api/locations                    # Agences
GET    /api/brands                       # Marques
POST   /api/contact                      # Contact (throttle:3)
POST   /api/orders                       # Créer commande
GET    /api/orders/{id}                 # Détail commande (token)
GET    /api/orders/{id}/receipt         # Reçu PDF
GET    /api/invoice/{id}                # Facture
```

#### Authentifié (Sanctum)
```
GET    /api/user                         # Profil
PUT    /api/user                         # Màj profil
POST   /api/user/change-password        # Changer mot de passe
POST   /api/logout                       # Déconnexion
GET    /api/my-orders                    # Mes commandes
POST   /api/orders/{id}/pay             # Paiement
GET    /api/wishlist                     # Wishlist
GET    /api/wishlist/ids                # IDs wishlist
POST   /api/wishlist/toggle             # Toggle wishlist
DELETE /api/wishlist/{productId}        # Retirer wishlist
DELETE /api/wishlist                     # Vider wishlist
POST   /api/products/{id}/reviews       # Soumettre avis
DELETE /api/reviews/{id}                # Supprimer avis
```

#### Admin (Sanctum + admin)
```
POST   /api/products                     # Créer produit
PUT    /api/products/{id}               # Modifier produit
DELETE /api/products/{id}               # Supprimer produit
GET    /api/admin/products/export       # Export produits
POST   /api/categories                   # Créer catégorie
PUT    /api/categories/{id}             # Modifier catégorie
DELETE /api/categories/{id}             # Supprimer catégorie
GET    /api/admin/orders                 # Toutes commandes
GET    /api/admin/orders/export         # Export commandes
PATCH  /api/admin/orders/{id}/status    # Màj statut
PATCH  /api/admin/orders/{id}/assign    # Assigner agent
PATCH  /api/admin/orders/{id}/payment   # Màj paiement
POST   /api/admin/orders/{id}/refund    # Remboursement
GET    /api/admin/orders/{id}/invoice   # Facture PDF
POST   /api/admin/orders/{id}/resend-invoice  # Renvoi facture
GET    /api/admin/reviews               # Tous avis
PATCH  /api/admin/reviews/{id}/approve  # Approuver avis
GET    /api/admin/stats                  # Dashboard
GET    /api/admin/users                  # Liste utilisateurs
```

---

## 6. Frontend React

### 6.1 Structure

```
Frond-end/test/src/
├── index.js                    # Point d'entrée React 19
├── index.scss                  # Styles globaux
├── App.js                      # Routes (React Router) + Providers
├── i18n.js                     # Configuration i18next
│
├── contexts/                   # 6 Contextes d'état global
│   ├── AuthContext.jsx         # Authentification + rôles
│   ├── CartContext.jsx         # Panier (localStorage)
│   ├── CompareContext.js       # Comparateur (max 3)
│   ├── LanguageContext.jsx     # Langue (fr/en/ar/es)
│   ├── ThemeContext.jsx        # Thème dark/light
│   └── WishlistContext.jsx     # Wishlist
│
├── layouts/
│   ├── MainLayout.jsx          # Layout public (Header + Footer + Sidebars)
│   └── AdminLayout.jsx         # Layout admin (sidebar + header)
│
├── components/
│   ├── atoms/
│   │   ├── BackToTop.jsx       # Bouton retour haut
│   │   ├── Breadcrumb.jsx      # Fil d'Ariane
│   │   ├── HeroScene.jsx       # Scène 3D Three.js
│   │   ├── Loader.jsx          # Loader animé
│   │   ├── MagicLogin.jsx      # Login sans mot de passe
│   │   ├── SEO.jsx             # Meta tags par page
│   │   ├── SkeletonLoader.jsx  # Placeholders chargement
│   │   ├── SplashScreen.jsx    # Écran démarrage animé
│   │   └── WhatsAppButton.jsx  # Bouton WhatsApp flottant
│   │
│   ├── molecules/
│   │   ├── BrandsMarquee.jsx   # Marques défilantes
│   │   ├── DealOfTheDay.jsx    # Promotion du jour (timer)
│   │   ├── LanguageSelector.jsx# Sélecteur langue
│   │   ├── LoginModal.jsx      # Modal connexion
│   │   ├── ProductCard.jsx     # Carte produit
│   │   └── WelcomePopup.jsx    # Popup bienvenue
│   │
│   ├── organisms/
│   │   ├── CartDrawer.jsx      # Panier coulissant (GSAP)
│   │   ├── CategoriesGrid.jsx  # Grille catégories
│   │   ├── CompareBar.jsx      # Barre comparaison fixe
│   │   ├── FilterSidebar.jsx   # Filtres produits
│   │   ├── InteractiveHero.jsx # Hero animé carousel
│   │   ├── InteractiveMap.jsx  # Carte agences interactive
│   │   ├── MegaMenu.jsx        # Menu méga catégories (GSAP)
│   │   ├── RelatedProducts.jsx # Produits similaires
│   │   ├── ReviewSection.jsx   # Section avis
│   │   └── SmartAssistant.jsx  # Chatbot guide d'achat
│   │
│   └── layouts/
│       ├── Header.jsx          # En-tête (logo, search, icons)
│       └── Footer.jsx          # Pied de page complet
│
├── pages/                      # 30 pages (React.lazy)
│   ├── Home.jsx                # Accueil
│   ├── Shop.jsx                # Catalogue
│   ├── ProductDetail.jsx       # Détail produit
│   ├── Checkout.jsx            # Tunnel commande
│   ├── Login.jsx               # Connexion
│   ├── Register.jsx            # Inscription
│   ├── OtpVerify.jsx           # Vérification OTP
│   ├── ForgotPassword.jsx      # Mot de passe oublié
│   ├── Account.jsx             # Mon compte
│   ├── Wishlist.jsx            # Favoris
│   ├── Comparison.jsx          # Comparateur
│   ├── OrderTracking.jsx       # Suivi commande
│   ├── VirtualPayment.jsx      # Paiement virtuel
│   ├── Contact.jsx             # Contact + carte
│   ├── Support.jsx             # Centre d'aide
│   ├── FAQ.jsx                 # Questions fréquentes
│   ├── Promotions.jsx          # Promotions
│   ├── Returns.jsx             # Retours
│   ├── Terms.jsx               # CGV
│   ├── MagicVerify.jsx         # Vérification magic link
│   ├── Dashboard.jsx           # Admin dashboard
│   ├── AdminProducts.jsx       # Admin produits
│   ├── AdminProductForm.jsx    # Formulaire produit
│   ├── AdminOrders.jsx         # Admin commandes
│   ├── AdminCategories.jsx     # Admin catégories
│   └── AdminUsers.jsx          # Admin utilisateurs
│
├── services/
│   ├── api.js                  # Axios instance + interceptors
│   └── image.js                # Résolveur URL images
│
├── utils/
│   └── excelExport.js          # Export XLSX client (ExcelJS)
│
├── data/
│   ├── categories.js           # Arbre catégories statique
│   ├── brands.json             # Marques avec logos/couleurs
│   └── delivery.js             # Frais livraison par ville
│
└── locales/
    ├── fr.json                 # 499 clés de traduction
    ├── en.json                 # Anglais
    ├── ar.json                 # Arabe (RTL)
    └── es.json                 # Espagnol
```

### 6.2 Arbre de navigation

```
                            ┌─ Accueil (/)
                            │
                            ├─ Connexion (/login)
                            ├─ Inscription (/register)
                            ├─ Vérification OTP (/verify-otp)
                            ├─ Mot de passe (/forgot-password)
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                  │
    Publique            Client             Admin
          │                 │                  │
    ┌─────┴─────┐    ┌─────┴──────┐    ┌─────┴──────┐
    │ Contact   │    │ Catalogue  │    │ Dashboard  │
    │ FAQ       │    │ Détail     │    │ Produits   │
    │ Promotions│    │ Checkout   │    │ Commandes  │
    │ CGV       │    │ Paiement   │    │ Catégories │
    │ Retours   │    │ Wishlist   │    │ Utilisateurs│
    │ Suivi cmd │    │ Compte     │    └────────────┘
    └──────────┘    │ Comparateur│
                    │ Support    │
                    └────────────┘
```

### 6.3 Internationalisation (i18next)

| Langue | Code | Direction |
|--------|------|-----------|
| Français | `fr` | LTR |
| English | `en` | LTR |
| العربية | `ar` | RTL |
| Español | `es` | LTR |

**Détection automatique :** Navigateur → localStorage → fallback 'fr'

### 6.4 Thème Dark/Light
- Persistance dans localStorage
- Toggle depuis le Header / AdminLayout
- Variables CSS personnalisées Tailwind
- Transition fluide entre les modes

---

## 7. Infrastructure Docker

### 7.1 Services

| Service | Dockerfile | Base Image | Ports | Dépendances |
|---------|-----------|------------|-------|-------------|
| **nginx** | `nginx/Dockerfile` | nginx:1.25-alpine | 8080:80, 443:443 | laravel (healthy), react (healthy) |
| **react** | `react/Dockerfile` | node:20-alpine | 3000 | – |
| **laravel** | `laravel/Dockerfile` | php:8.2-fpm-alpine | 9000 | mysql (healthy), redis (healthy) |
| **mysql** | – | mysql:8.0 | 3307:3306 | – |
| **redis** | – | redis:7-alpine | 6379 | – |
| **queue-worker** | `laravel/Dockerfile` | php:8.2-fpm-alpine | – | laravel, redis |
| **scheduler** | `laravel/Dockerfile` | php:8.2-fpm-alpine | – | laravel |
| **phpmyadmin** | – | phpmyadmin:latest | 8888:80 | mysql (profile: dev) |
| **mailpit** | – | axllent/mailpit | 8025, 1025 | (profile: dev) |

### 7.2 Fichiers docker

```
docker/
├── .env                          # Variables d'environnement
├── .env.example                  # Template
├── docker-compose.yml            # Configuration principale
├── docker-compose.override.yml   # Surcharges dev
├── docker-compose.prod.yml       # Configuration production
│
├── nginx/
│   ├── Dockerfile                # Nginx + curl + confs
│   ├── nginx.conf                # Configuration globale
│   ├── default.conf              # Config de base (modèle)
│   ├── default.dev.conf          # Config dev (HMR, CORS preflight)
│   └── default.prod.conf         # Config prod (SSL, cache)
│
├── laravel/
│   ├── Dockerfile                # 3 stages (base, vendor, production)
│   ├── php.ini                   # PHP config (upload 64M, timezone Africa/Casablanca)
│   ├── www.conf                  # Pool FPM (user electro, catch_workers_output)
│   ├── fpm.conf                  # FPM global (error_log fichier)
│   └── entrypoint.sh             # chown volumes → su-exec electro php-fpm
│
├── react/
│   └── Dockerfile                # 4 stages (deps, dev, build, production)
│
├── mysql/init/
│   └── 01-database.sql           # SQL initial (charset utf8mb4)
│
└── scripts/
    ├── start-dev.sh              # Reset complet dev
    ├── docker-setup.sh           # Setup initial
    └── backup-db.sh              # Backup MySQL automatisé
```

### 7.3 Volumes

| Volume | Container | Chemin | Persistant |
|--------|-----------|--------|------------|
| `mysql-data` | mysql | /var/lib/mysql | Oui |
| `redis-data` | redis | /data | Oui |
| `laravel-storage` | laravel, queue, scheduler, nginx | /var/www/storage | Oui |
| `laravel-framework` | laravel, queue, scheduler | /var/www/bootstrap/cache | Oui |
| `react-build` | react, nginx | /build (react), /var/www/html (nginx) | Non (reconstruit) |

### 7.4 Santé (Healthchecks)

Tous les services ont des healthchecks Docker :
- **laravel** : `pgrep -f "php-fpm: pool"` (interval: 30s, retries: 3, start: 60s)
- **mysql** : `mysqladmin ping` (interval: 10s, retries: 5)
- **redis** : `redis-cli ping` (interval: 10s, retries: 3)
- **queue** : `pgrep -f "queue:work"` (interval: 15s, retries: 3)
- **scheduler** : `pgrep -f "schedule:run"` (interval: 15s, retries: 3)
- **react** : `wget -qO- http://127.0.0.1:3000` (dev interval: 30s, start: 120s)
- **nginx** : Curl health endpoint

---

## 8. Sécurité

### Mesures implémentées

| Catégorie | Mesure |
|-----------|--------|
| **API** | Authentification Bearer token (Sanctum) |
| **API** | Rate limiting (login:5, register:3, contact:3, OTP:3/60s) |
| **API** | Validation stricte des entrées ($request->validate) |
| **API** | Middleware `admin` (vérification `role === 'admin'`) |
| **API** | Middleware `verified.email` (email_verified === true) |
| **Base** | Hachage bcrypt des mots de passe |
| **Base** | Tokens SHA256 uniques |
| **Base** | MySQL non exposé en production |
| **Réseau** | Réseaux Docker isolés (frontend/backend) |
| **Web** | Headers HTTP sécurité (X-Frame-Options, X-XSS-Protection, etc.) |
| **Web** | Google reCAPTCHA v2 sur login |
| **Nginx** | Gzip, cache long terme des assets |
| **Logs** | Journalisation actions admin (activity_logs) |
| **Commande** | secure_token 64 hex pour accès commande sans auth |
| **Email** | Vérification email obligatoire pour commander |

---

## 9. Installation & Déploiement

### 9.1 Prérequis
- Docker Desktop 29+ (Compose V5)
- Git
- 8 Go RAM minimum

### 9.2 Développement (dev)

```bash
# Cloner
git clone <repo-url>
cd 05-Electro-profesionnels/docker

# Configurer
cp .env.example .env

# Build & lancer
docker compose --profile dev -f docker-compose.yml -f docker-compose.override.yml up -d --build

# Vérifier l'état
docker compose --profile dev ps

# Logs
docker compose --profile dev logs -f laravel

# Arrêter
docker compose --profile dev down

# Reset complet
docker compose --profile dev down -v
docker compose --profile dev -f docker-compose.yml -f docker-compose.override.yml up -d --build
```

### 9.3 Production

```bash
cd docker
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### 9.4 Accès

| Service | URL | Identifiant |
|---------|-----|-------------|
| **Site** | http://localhost:8080 | – |
| **phpMyAdmin** | http://localhost:8888 | root / (mysql root password) |
| **Mailpit** | http://localhost:8025 | – |
| **MySQL** | localhost:3307 | root / (mysql root password) |

### 9.5 Identifiants par défaut

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| **Admin** | chzakaria037@gmail.com | 48Pgvv99 |
| **Client test** | john@example.com | password123 |

### 9.6 Commandes utiles

```bash
# Lancer artisan dans le container
docker exec electro-laravel php artisan migrate:fresh --seed

# Voir les logs Laravel
docker exec electro-laravel tail -f storage/logs/laravel.log

# Backup BDD
bash scripts/backup-db.sh

# Shell dans le container
docker exec -it electro-laravel sh
```

---

## 10. Défis & Solutions

### Problème 1 : CORS avec architecture Headless
**Problème :** React (port 3000) et Laravel (port 8000) ont des origins différents → bloqué par le navigateur.
**Solution :** Architecture Nginx reverse proxy — un seul origin (:8080) sert à la fois le frontend et l'API. Zéro CORS nécessaire.

### Problème 2 : POST body non parsé par PHP-FPM
**Problème :** Les requêtes POST JSON arrivaient avec Content-Length correct mais `$request->input()` vide. Le diagnostic a montré que `curl.exe` sous PowerShell perdait les guillemets doubles du JSON (échappement shell).
**Solution :** Utiliser `-d @file.json` au lieu de `-d 'json_string'`. Aucun bug Docker/PHP.

### Problème 3 : Redis connection non configurée
**Problème :** `SESSION_CONNECTION=redis` pointait vers une connexion nommée "redis" alors que `config/database.php` définit une connexion par défaut nommée "default".
**Solution :** Changer `SESSION_CONNECTION: redis` → `SESSION_CONNECTION: default` dans `docker-compose.yml`.

### Problème 4 : Conflit de port 80 avec IIS
**Problème :** Windows exécute IIS sur le port 80 (PID 4). Docker ne peut pas bind le port 80.
**Solution :** Tout le projet passe par le port 8080. L'override docker avait un `ports: - "80:80"` en conflit avec la variable de port → supprimé de l'override.

### Problème 5 : Build React échouait sur `npm ci`
**Problème :** `react-scripts@5` nécessite `typescript@<=5` mais le `package.json` imposait `typescript@^6`. Conflit de dépendances.
**Solution :** Ajout de `--legacy-peer-deps` à `npm ci` dans le Dockerfile React.

### Problème 6 : PHP-FPM ne pouvait pas écrire dans `/proc/self/fd/2`
**Problème :** L'utilisateur non-root (`electro`) n'a pas accès aux descripteurs de fichier du processus parent.
**Solution :** Configurer `error_log` vers un fichier dans `fpm.conf` au lieu de `/proc/self/fd/2`.

### Problème 7 : php-fpm-healthcheck incompatible Alpine
**Problème :** Le package `php-fpm-healthcheck` nécessite une glibc complète ; Alpine utilise musl.
**Solution :** Healthcheck personnalisé avec `pgrep -f "php-fpm: pool"`.

### Problème 8 : Stockage des fichiers (symlink storage)
**Problème :** Le symlink `public/storage → /var/www/storage/app/public` pointait vers un chemin Windows invalide (bind mount hôte).
**Solution :** Symlink corrigé pour pointer vers le chemin à l'intérieur du container.

### Problème 9 : END OF CENTRAL DIRECTORY RECORD not found
**Problème :** Sur Windows, `composer install` avec des chemins longs échoue. Le `composer.lock` peut être corrompu.
**Solution :** Utiliser Docker pour exécuter composer (dans le container Linux) ou régénérer le fichier lock.

### Problème 10 : Nginx ne pouvait pas proxy vers laravel
**Problème :** La conf Nginx utilisait `proxy_pass http://laravel_upstream` mais PHP-FPM parle le protocole FastCGI, pas HTTP.
**Solution :** Remplacer par `fastcgi_pass laravel:9000` avec `SCRIPT_FILENAME`, `REQUEST_URI`, et `include fastcgi_params`.

---

## 11. Améliorations futures

| Amélioration | Priorité | Description |
|-------------|----------|-------------|
| 💳 Paiement réel API CMI/Stripe | Haute | Intégration passerelle de paiement marocaine CMI |
| 📱 Application mobile React Native | Haute | Version mobile native iOS/Android |
| 🔔 Notifications temps réel (WebSockets) | Haute | Laravel Echo + Pusher/reverb |
| 🤖 Système de recommandations IA | Moyenne | Suggestions basées historique achats |
| 📊 Analytics avancés | Moyenne | Google Analytics / Matomo |
| 🚚 Tracking colis live | Moyenne | API de suivi transporteur |
| ⭐ Programme fidélité | Moyenne | Points de fidélité, réductions |
| 🌐 Multi-boutique | Basse | Plusieurs magasins virtuels |
| 🧪 Tests automatisés | Haute | PHPUnit + Jest/Cypress (E2E) |
| 🔄 CI/CD pipeline | Haute | GitHub Actions (tests, build, déploiement) |
| 📦 PWA | Moyenne | Mode hors-ligne, installation mobile |
| 🖼️ Optimisation images | Moyenne | WebP auto, lazy loading serveur |

---

*Document généré pour le projet Electro-05 — E-commerce High-Tech Headless*
*© 2026 — Zakaria Chamekh*
