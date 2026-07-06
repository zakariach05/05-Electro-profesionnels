<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=Electro-05&fontSize=70&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Plateforme%20E-commerce%20High-Tech%20%E2%80%94%20Architecture%20Headless&descAlignY=55&descSize=20"/>

<img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Electric%20plug/3D/electric_plug_3d.png" width="110"/>

<br/>

<img src="https://readme-typing-svg.demolab.com/?lines=%E2%9A%A1+E-commerce+moderne%2C+performant+%26+scalable;%F0%9F%9B%92+Vente+Smartphones+%C2%B7+PC+%C2%B7+Gaming;%F0%9F%87%B2%F0%9F%87%A6+Cibl%C3%A9+march%C3%A9+marocain+(MAD%2FDH);%F0%9F%90%B3+9+conteneurs+Docker+orchestr%C3%A9s&font=Fira%20Code&center=true&width=700&height=45&color=61DAFB&vCenter=true&size=22&pause=1800"/>

<br/><br/>

![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Laravel](https://img.shields.io/badge/Laravel_12-FF2D20?logo=laravel&logoColor=white&style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?logo=mysql&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Redis](https://img.shields.io/badge/Redis_7-DC382D?logo=redis&logoColor=white&style=for-the-badge)

![Nginx](https://img.shields.io/badge/Nginx_1.25-009639?logo=nginx&logoColor=white)
![API](https://img.shields.io/badge/API-REST-green)
![ThreeJS](https://img.shields.io/badge/Three.js-3D_Viewer-black?logo=three.js)
![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?logo=greensock&logoColor=white)
![Status](https://img.shields.io/badge/Status-En%20développement-orange?style=flat&labelColor=black)
![License](https://img.shields.io/badge/License-MIT-blue)

<img src="https://raw.githubusercontent.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/main/images/blue-black-cyberpunk.gif" width="100%">

</div>

---

## 📑 Table des Matières

1. [Présentation du Projet](#-présentation-du-projet)
2. [Fonctionnalités Principales](#-fonctionnalités-principales)
3. [Architecture Globale](#️-architecture-globale)
4. [Stack Technologique](#️-stack-technologique)
5. [Structure du Projet](#️-structure-du-projet)
6. [Modèles & Base de Données](#️-modèles--base-de-données)
7. [API REST – Endpoints Complets](#-api-rest--endpoints-complets)
8. [Authentification](#-authentification-multi-méthodes)
9. [Modules Fonctionnels](#-modules-fonctionnels)
10. [Diagrammes UML](#-diagrammes-uml)
11. [Notifications Email](#-notifications-email)
12. [Sécurité](#-sécurité)
13. [Performance](#-performance)
14. [Installation & Déploiement](#-installation--déploiement-docker)
15. [Données de Seed](#-données-de-seed)
16. [Pages Frontend](#️-pages-frontend)
17. [Améliorations Futures](#-améliorations-futures)
18. [Auteur](#-auteur)

---

## 🧠 Présentation du Projet

<img align="right" width="260" src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Shopping%20cart/3D/shopping_cart_3d.png"/>

**Electro-05** est une plateforme **E-commerce B2C** construite selon une **architecture Headless** avec conteneurisation **Docker** complète.

Le frontend React est totalement découplé du backend Laravel, garantissant **performance, sécurité et évolutivité**.

> 💡 Conçu pour le marché marocain, ce projet propose une expérience d'achat moderne en 4 langues (fr, en, ar, es) avec un système multi-vendeurs intégré et une **visionneuse 3D** des produits (Three.js).

<br clear="right"/>

---

## ✨ Fonctionnalités Principales

<div align="center">
<img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Sparkles/3D/sparkles_3d.png" width="70"/>
</div>

| Catégorie | Fonctionnalité |
|-----------|---------------|
| 🛍️ **Catalogue** | Produits dynamiques avec filtres multi-critères (prix, marque, état, promo, stock) |
| 🛒 **Panier** | Panier client-side (localStorage) avec persistance navigateur |
| 🔐 **Auth** | 4 méthodes : Email/Password, Google OAuth, Magic Link, OTP |
| 📦 **Commandes** | Création, suivi par token sécurisé, sous-commandes par vendeur |
| 💳 **Paiement** | Paiement virtuel CB avec validation Luhn + facture PDF |
| 🧑‍💼 **Admin** | Dashboard KPIs, graphiques, CRUD produits/catégories, exports CSV/XLSX |
| 🤖 **Assistant** | Chatbot guide d'achat par questions/réponses |
| 🌍 **i18n** | 4 langues (Français, English, العربية, Español) avec support RTL |
| 🎨 **UI/UX** | Thème Dark/Light, animations GSAP, **visionneuse 3D (Three.js)** |
| 🧩 **Multi-vendeurs** | Découpage automatique des commandes par vendeur |
| 📧 **Emails** | 10+ templates transactionnels (OTP, confirmation, facture, contact…) |
| 🐳 **Docker** | Déploiement automatisé avec 9 conteneurs orchestrés |
| ❤️ **Wishlist** | Favoris utilisateur avec toggle + liste dédiée |
| ⚖️ **Comparateur** | Comparaison jusqu'à 3 produits en tableau |
| ⭐ **Avis** | Système de notes 1-5 étoiles avec modération admin |
| 📍 **Carte** | 8 localisations (agences + points relais) sur carte interactive |
| 📄 **PDF** | Génération de reçus/factures PDF via DomPDF |
| 🔔 **Notifications** | Emails transactionnels asynchrones via Redis Queue Worker |

---

## 🏗️ Architecture Globale

```mermaid
%%{init: {'theme':'dark', 'themeVariables': { 'primaryColor': '#61DAFB', 'edgeLabelBackground':'#1a1a2e', 'fontSize':'14px'}}}%%
graph TB
    subgraph "Couche Presentation"
        USER((👤 Utilisateur))
    end

    subgraph "Reverse Proxy Docker"
        NGINX[🌐 Nginx :8080 Reverse Proxy]
    end

    subgraph "Frontend electro_frontend"
        REACT[⚛️ React 19 SPA :3000 Tailwind + GSAP + Three.js]
    end

    subgraph "Backend electro_backend"
        LARAVEL[🔥 Laravel 12 API :9000 PHP 8.2 FPM]
        QUEUE[📬 Queue Worker Redis Listener]
        SCHED[⏱️ Scheduler Taches planifiees]
    end

    subgraph "Donnees"
        MYSQL[(🗄️ MySQL 8.0 20+ tables)]
        REDIS[(⚡ Redis 7 Cache + Queue)]
    end

    subgraph "Dev Tools"
        MAIL[✉️ Mailpit :8025 SMTP Dev]
        PHPMY[🛠️ phpMyAdmin :8888 BDD GUI]
    end

    USER -->|HTTP :8080| NGINX
    NGINX -->|/api/ fastcgi :9000| LARAVEL
    NGINX -->|/ proxy_pass :3000| REACT
    NGINX -->|/storage/ static| LARAVEL
    LARAVEL --> MYSQL
    LARAVEL --> REDIS
    QUEUE --> REDIS
    QUEUE --> MYSQL
    SCHED --> LARAVEL
    MAIL -.->|SMTP dev| LARAVEL
    PHPMY -.->|admin GUI| MYSQL
```

**9 conteneurs orchestrés :** `nginx` · `react` · `laravel` · `mysql` · `redis` · `phpmyadmin` · `queue-worker` · `scheduler` · `mailpit`

---

## ⚙️ Stack Technologique

<div align="center">

### 🎨 Frontend
<img src="https://skillicons.dev/icons?i=react,tailwind,threejs,js&theme=dark" />

### 🔧 Backend
<img src="https://skillicons.dev/icons?i=laravel,php,mysql,redis&theme=dark" />

### 🐳 Infrastructure
<img src="https://skillicons.dev/icons?i=docker,nginx,git,github&theme=dark" />

</div>

### 🎨 Frontend

| Technologie | Version | Rôle |
|-------------|---------|------|
| **React.js** | 19 | SPA avec code-splitting et lazy loading |
| **Tailwind CSS** | 3 | UI moderne et responsive |
| **GSAP** | 3 | Animations premium (drawer, mega menu) |
| **Three.js** | latest | Visionneuse 3D produits |
| **i18next** | latest | Internationalisation 4 langues avec RTL |
| **Axios** | latest | Communication API REST |
| **React Context** | – | État global (Auth, Cart, Compare, Theme, Wishlist, Lang) |
| **ExcelJS** | latest | Export XLSX côté client |

### 🔧 Backend

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Laravel** | 12 | API REST principale |
| **PHP** | 8.2 FPM | Runtime optimisé Alpine |
| **Laravel Sanctum** | – | Authentification par tokens Bearer |
| **MySQL** | 8.0 | Base de données relationnelle (20+ tables) |
| **Redis** | 7 | Cache, sessions, files d'attente |
| **DomPDF** | latest | Génération factures/reçus PDF |
| **Maatwebsite/Excel** | latest | Export CSV/XLSX serveur |
| **Mailpit** | latest | SMTP de développement |

### 🐳 Infrastructure Docker

| Service | Image | Port | Rôle |
|---------|-------|------|------|
| **nginx** | nginx:1.25-alpine | 8080:80, 443:443 | Reverse proxy unique |
| **react** | node:20-alpine | 3000 | SPA HMR (dev) / Build statique (prod) |
| **laravel** | php:8.2-fpm-alpine | 9000 | API PHP-FPM |
| **mysql** | mysql:8.0 | 3307:3306 | Base de données |
| **redis** | redis:7-alpine | 6379 | Cache + Queue + Sessions |
| **phpmyadmin** | phpmyadmin:latest | 8888:80 | Gestion BDD (dev) |
| **queue-worker** | php:8.2-fpm-alpine | – | File d'attente Redis |
| **scheduler** | php:8.2-fpm-alpine | – | Tâches planifiées Laravel |
| **mailpit** | axllent/mailpit | 8025:8025, 1025:1025 | SMTP dev |

---

## 🗂️ Structure du Projet

```
05-Electro-profesionnels/
│
├── README.md                     <- Ce fichier
├── Functional_Specification.md   <- Cahier des charges
├── PROJET_DOCUMENTATION.md       <- Documentation technique
├── Requete-SQL.txt               <- Requetes SQL utiles
├── .env                          <- Variables d'environnement
│
├── Back-end/                     <- API Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/      <- 16 controleurs REST
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── ProductController.php
│   │   │   │   ├── OrderController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   ├── ReviewController.php
│   │   │   │   ├── WishlistController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   ├── OtpController.php
│   │   │   │   ├── MagicLinkController.php
│   │   │   │   ├── GoogleAuthController.php
│   │   │   │   ├── PaymentController.php
│   │   │   │   ├── ReceiptController.php
│   │   │   │   ├── InvoiceController.php
│   │   │   │   └── LocationController.php
│   │   │   └── Middleware/
│   │   │       ├── AdminMiddleware.php
│   │   │       ├── EmailVerifiedMiddleware.php
│   │   │       └── SetLocale.php
│   │   ├── Models/               <- 13 modeles Eloquent
│   │   ├── Mail/                 <- Classes Mailable
│   │   ├── Observers/            <- ProductObserver
│   │   └── Exports/              <- Classes export
│   ├── database/
│   │   ├── migrations/           <- 20 migrations
│   │   └── seeders/              <- 9 seeders
│   ├── resources/views/
│   │   ├── emails/               <- 10 templates email Blade
│   │   └── pdf/                  <- Templates facture PDF
│   └── routes/
│       ├── api.php               <- 50+ endpoints REST
│       └── web.php
│
├── Frond-end/test/               <- React 19 SPA
│   └── src/
│       ├── components/           <- Atoms / Molecules / Organisms
│       ├── contexts/             <- 6 contextes React
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   ├── CompareContext.jsx
│       │   ├── LanguageContext.jsx
│       │   ├── ThemeContext.jsx
│       │   └── WishlistContext.jsx
│       ├── pages/                <- 30 pages (public / client / admin)
│       ├── services/             <- Couche API Axios
│       ├── locales/              <- fr, en, ar, es (500+ cles)
│       └── layouts/              <- MainLayout, AdminLayout
│
└── docker/                       <- Infrastructure complete
    ├── docker-compose.yml
    ├── docker-compose.override.yml
    ├── docker-compose.prod.yml
    ├── nginx/
    ├── laravel/
    ├── react/
    ├── mysql/
    └── scripts/
```

---

## 🗄️ Modèles & Base de Données

### Tables Métier (13 tables)

| Table | Rôle | Clés étrangères |
|-------|------|-----------------|
| `users` | Comptes clients + admin | – |
| `categories` | Arborescence hiérarchique 3 niveaux | `parent_id → categories.id` |
| `sellers` | Vendeurs/préparateurs multi-vendor | – |
| `products` | Catalogue avec images JSON, état, promo | `category_id, seller_id` |
| `orders` | Commandes clients avec token sécurisé | – |
| `order_items` | Articles d'une commande (prix figé) | `order_id, product_id, sub_order_id` |
| `sub_orders` | Sous-commandes découpées par vendeur | `order_id, seller_id` |
| `reviews` | Avis clients 1-5 étoiles avec modération | `product_id, user_id` |
| `wishlists` | Favoris utilisateurs | `user_id, product_id` |
| `otps` | Codes OTP 6 chiffres (vérification + reset) | `email` |
| `magic_links` | Tokens connexion sans mot de passe SHA256 | `email` |
| `locations` | Agences et points relais avec lat/lng | – |
| `activity_logs` | Journalisation actions admin | `user_id → users.id` |

### Tables Système Laravel (7)

`personal_access_tokens` · `password_reset_tokens` · `sessions` · `cache` · `cache_locks` · `jobs` · `failed_jobs`

---

## 📋 API REST – Endpoints Complets

### 🔓 Routes Publiques

| Méthode | URI | Rate Limit | Description |
|---------|-----|------------|-------------|
| `POST` | `/api/register` | 3/min | Inscription + envoi OTP |
| `POST` | `/api/login` | 5/min | Connexion email/password |
| `POST` | `/api/auth/google` | – | OAuth Google (token) |
| `POST` | `/api/auth/magic-link` | – | Envoi magic link email |
| `POST` | `/api/auth/magic-verify` | – | Vérification magic link |
| `POST` | `/api/otp/send-verification` | – | Envoi OTP vérification |
| `POST` | `/api/otp/verify-email` | – | Validation OTP email |
| `POST` | `/api/otp/send-reset` | – | Envoi OTP reset password |
| `POST` | `/api/otp/reset-password` | – | Réinitialisation password |
| `GET` | `/api/products` | – | Catalogue (filtres + pagination 12/page) |
| `GET` | `/api/products/{id}` | – | Détail produit |
| `GET` | `/api/categories` | – | Arborescence catégories |
| `GET` | `/api/categories/{id}` | – | Détail catégorie |
| `GET` | `/api/products/{id}/reviews` | – | Avis approuvés |
| `GET` | `/api/locations` | – | Agences + points relais |
| `GET` | `/api/brands` | – | Liste des marques |
| `POST` | `/api/contact` | 3/min | Formulaire de contact |
| `POST` | `/api/orders` | – | Créer commande (guest autorisé) |
| `GET` | `/api/orders/{id}` | – | Suivi par token sécurisé |
| `GET` | `/api/orders/{id}/receipt` | – | Reçu PDF |
| `GET` | `/api/invoice/{id}` | – | Facture PDF |

### 🔐 Routes Authentifiées (Sanctum Bearer)

| Méthode | URI | Description |
|---------|-----|-------------|
| `GET` | `/api/user` | Profil utilisateur connecté |
| `PUT` | `/api/user` | Mise à jour profil |
| `POST` | `/api/user/change-password` | Changement mot de passe |
| `POST` | `/api/logout` | Déconnexion (révocation token) |

### ✅ Routes Email Vérifié (auth + verified)

| Méthode | URI | Description |
|---------|-----|-------------|
| `GET` | `/api/my-orders` | Mes commandes |
| `POST` | `/api/orders/{id}/pay` | Paiement virtuel CB |
| `POST` | `/api/products/{id}/reviews` | Poster un avis |
| `DELETE` | `/api/reviews/{id}` | Supprimer un avis |
| `GET` | `/api/wishlist` | Ma liste de favoris |
| `GET` | `/api/wishlist/ids` | IDs wishlist |
| `POST` | `/api/wishlist/toggle` | Ajouter/retirer favori |
| `DELETE` | `/api/wishlist/{id}` | Retirer un favori |
| `DELETE` | `/api/wishlist` | Vider wishlist |

### 👑 Routes Admin (auth + role=admin)

| Méthode | URI | Description |
|---------|-----|-------------|
| `POST` | `/api/products` | Créer produit |
| `PUT` | `/api/products/{id}` | Modifier produit |
| `DELETE` | `/api/products/{id}` | Supprimer produit |
| `GET` | `/api/admin/products/export` | Export CSV/XLSX produits |
| `POST` | `/api/categories` | Créer catégorie |
| `PUT` | `/api/categories/{id}` | Modifier catégorie |
| `DELETE` | `/api/categories/{id}` | Supprimer catégorie |
| `GET` | `/api/admin/orders` | Toutes les commandes (paginées) |
| `GET` | `/api/admin/orders/export` | Export commandes CSV/XLSX |
| `PATCH` | `/api/admin/orders/{id}/status` | Changer statut commande |
| `PATCH` | `/api/admin/orders/{id}/assign` | Assigner agent livreur |
| `PATCH` | `/api/admin/orders/{id}/payment` | Changer statut paiement |
| `POST` | `/api/admin/orders/{id}/refund` | Remboursement partiel/total |
| `GET` | `/api/admin/orders/{id}/invoice` | Générer facture |
| `POST` | `/api/admin/orders/{id}/resend-invoice` | Renvoyer facture email |
| `GET` | `/api/admin/reviews` | Tous les avis (modération) |
| `PATCH` | `/api/admin/reviews/{id}/approve` | Approuver/désapprouver avis |
| `GET` | `/api/admin/stats` | Dashboard KPIs + graphiques |
| `GET` | `/api/admin/users` | Liste utilisateurs |

---

## 🔐 Authentification Multi-Méthodes

| Méthode | Route | Sécurité | Expiration |
|---------|-------|----------|------------|
| Email + Password | `POST /api/login` | Bcrypt + Rate limit 5/min | Token révocable |
| Inscription | `POST /api/register` | Rate limit 3/min + OTP email | – |
| Google OAuth | `POST /api/auth/google` | Token Google vérifié | Token révocable |
| Magic Link | `POST /api/auth/magic-link` | SHA256 usage unique | 15 minutes |
| OTP Email | `POST /api/otp/verify-email` | 6 chiffres, 3 tentatives max | 10 minutes |
| OTP Reset | `POST /api/otp/reset-password` | 6 chiffres | 10 minutes |
| reCAPTCHA v2 | Form login | Google reCAPTCHA | Par requête |

---

## 🧩 Modules Fonctionnels

<details>
<summary><b>🔑 Module 1 – Authentification & Utilisateurs</b></summary>
<br/>

- Inscription avec email unique, mot de passe hashé Bcrypt
- 4 méthodes de connexion (email, Google OAuth, Magic Link, OTP)
- Vérification email obligatoire par OTP 6 chiffres valable 10 min
- Reset mot de passe par OTP sécurisé
- Gestion profil : nom, téléphone, ville, adresse, avatar
- Administration utilisateurs (liste côté admin)
</details>

<details>
<summary><b>🛍️ Module 2 – Catalogue & Produits</b></summary>
<br/>

- Navigation avec filtres : catégorie, prix, marque, état, promo, stock, featured
- Pagination serveur : 12 produits/page
- Arborescence catégories hiérarchique (3 niveaux, récursif)
- Wishlist toggle (ajout/retrait favoris, email vérifié requis)
- Comparateur de produits jusqu'à 3 produits (localStorage)
- Avis & notes 1-5 étoiles avec modération admin, 1 avis/utilisateur/produit
- Système multi-vendeurs avec sous-commandes automatiques
</details>

<details>
<summary><b>🛒 Module 3 – Panier, Commande & Paiement</b></summary>
<br/>

- Panier localStorage avec persistance, frais livraison 100 DH
- Checkout guest ou authentifié avec adresse de livraison
- Création commande : Order + OrderItems + SubOrders par vendeur + déduction stock
- Paiement virtuel CB avec validation algorithme de Luhn
- Reçu PDF téléchargeable via DomPDF + template Blade
- Suivi commande par token sécurisé 64 caractères hexadécimaux (sans auth)
</details>

<details>
<summary><b>📊 Module 4 – Dashboard Administration</b></summary>
<br/>

- KPIs temps réel : commandes, revenus, produits, utilisateurs, avis
- Graphiques : revenus 30 jours, répartition paiements, statuts commandes
- Top 10 produits les plus vendus + top 10 villes clientes
- CRUD complet produits + catégories + gestion commandes
- Modération avis clients (approbation/rejet)
- Export CSV/XLSX produits et commandes
- Logs d'activité admin journalisés avec IP
</details>

<details>
<summary><b>💬 Module 5 – Support Client</b></summary>
<br/>

- Formulaire de contact (rate limit 3/min, email admin + confirmation client)
- Suivi commande sans authentification via token sécurisé
- Assistant chatbot (questions → suggestions produits)
- Carte interactive 8 localisations (3 agences + 5 points relais)
- Bouton WhatsApp flottant
</details>

<details>
<summary><b>🐳 Module 6 – Infrastructure & Déploiement</b></summary>
<br/>

- 9 conteneurs Docker orchestrés (dev + prod)
- Hot-reload dev avec bind mounts
- SSL/HTTPS en production
- Backup BDD automatisé (script Bash)
- Healthchecks sur tous les services
- Logs PHP-FPM + Nginx
</details>

---

## 📐 Diagrammes UML

### 📌 Diagramme de Cas d'Utilisation (Use Case)

```mermaid
graph LR
    GUEST([Visiteur])
    CLIENT([Client Connecte])
    ADMIN([Admin])
    SYSTEM([Systeme])
    GOOGLE([Google OAuth])

    subgraph AUTH ["Module 1 Authentification"]
        UC1(S inscrire)
        UC2(Se connecter par email)
        UC3(Connexion Google OAuth)
        UC4(Connexion Magic Link)
        UC5(Verifier email OTP)
        UC6(Reset mot de passe OTP)
        UC7(Gerer profil utilisateur)
        UC8(Se deconnecter)
    end

    subgraph CATALOG ["Module 2 Catalogue"]
        UC9(Parcourir le catalogue)
        UC10(Filtrer les produits)
        UC11(Rechercher un produit)
        UC12(Voir detail produit)
        UC13(Gerer wishlist favoris)
        UC14(Comparer des produits)
        UC15(Laisser un avis note)
    end

    subgraph ORDER_MOD ["Module 3 Commande et Paiement"]
        UC16(Gerer le panier)
        UC17(Passer une commande)
        UC18(Payer en ligne CB)
        UC19(Suivre commande par token)
        UC20(Telecharger facture PDF)
    end

    subgraph ADMIN_MOD ["Module 4 Administration"]
        UC21(Voir dashboard KPIs)
        UC22(CRUD Produits)
        UC23(CRUD Categories)
        UC24(Gerer les commandes)
        UC25(Moderer les avis)
        UC26(Exporter donnees XLSX)
        UC27(Voir liste utilisateurs)
    end

    subgraph SUPPORT_MOD ["Module 5 Support"]
        UC28(Contacter le support)
        UC29(Utiliser assistant chatbot)
        UC30(Voir carte agences)
    end

    GUEST --> UC1
    GUEST --> UC2
    GUEST --> UC3
    GUEST --> UC9
    GUEST --> UC10
    GUEST --> UC11
    GUEST --> UC12
    GUEST --> UC16
    GUEST --> UC17
    GUEST --> UC19
    GUEST --> UC28
    GUEST --> UC30

    CLIENT --> UC5
    CLIENT --> UC6
    CLIENT --> UC7
    CLIENT --> UC8
    CLIENT --> UC13
    CLIENT --> UC14
    CLIENT --> UC15
    CLIENT --> UC18
    CLIENT --> UC20
    CLIENT --> UC29

    ADMIN --> UC21
    ADMIN --> UC22
    ADMIN --> UC23
    ADMIN --> UC24
    ADMIN --> UC25
    ADMIN --> UC26
    ADMIN --> UC27
    ADMIN --> UC9

    SYSTEM -.->|Inclut creation SubOrders| UC17
    GOOGLE -.->|Token OAuth| UC3
```

---

### 🏗️ Diagramme de Classes

```mermaid
classDiagram
    direction TB

    class User {
        +int id
        +string name
        +string email
        +string password
        +string role
        +string phone
        +string city
        +string address
        +string avatar
        +string google_id
        +bool email_verified
        +timestamp email_verified_at
        +wishlist() HasMany
        +reviews() HasMany
    }

    class Product {
        +int id
        +int category_id
        +int seller_id
        +string name
        +string slug
        +string description
        +decimal price
        +decimal old_price
        +string image
        +array images
        +int stock
        +bool is_featured
        +enum state
        +int promo
        +string delivery_type
        +category() BelongsTo
        +seller() BelongsTo
        +reviews() HasMany
        +orderItems() HasMany
        +getAverageRatingAttribute() float
    }

    class Category {
        +int id
        +string name
        +string slug
        +string image
        +int parent_id
        +products() HasMany
        +parent() BelongsTo
        +children() HasMany
    }

    class Seller {
        +int id
        +string name
        +string city
        +string email
        +string logo
        +int prep_days
        +products() HasMany
        +subOrders() HasMany
    }

    class Order {
        +int id
        +string customer_name
        +string customer_email
        +string customer_phone
        +string customer_address
        +string customer_city
        +string order_notes
        +decimal total_amount
        +decimal refunded_amount
        +string status
        +string secure_token
        +bool email_sent
        +string assigned_agent
        +string payment_method
        +string payment_status
        +bool acompte_paid
        +items() HasMany
        +subOrders() HasMany
    }

    class OrderItem {
        +int id
        +int order_id
        +int sub_order_id
        +int product_id
        +int quantity
        +decimal price
        +order() BelongsTo
        +subOrder() BelongsTo
        +product() BelongsTo
    }

    class SubOrder {
        +int id
        +int order_id
        +int seller_id
        +decimal subtotal
        +string status
        +string delivery_estimate
        +order() BelongsTo
        +seller() BelongsTo
        +items() HasMany
    }

    class Review {
        +int id
        +int product_id
        +int user_id
        +int rating
        +string title
        +string body
        +bool verified_purchase
        +bool approved
        +product() BelongsTo
        +user() BelongsTo
    }

    class Wishlist {
        +int id
        +int user_id
        +int product_id
        +product() BelongsTo
        +user() BelongsTo
    }

    class Otp {
        +int id
        +string email
        +string code
        +string type
        +bool used
        +timestamp expires_at
        +isValid() bool
        +generate(email, type)$ Otp
    }

    class MagicLink {
        +int id
        +string email
        +string token
        +timestamp expires_at
        +timestamp used_at
    }

    class Location {
        +int id
        +string name
        +string city
        +string address
        +decimal latitude
        +decimal longitude
        +string type
    }

    class ActivityLog {
        +int id
        +int user_id
        +string action
        +string target_type
        +string target_id
        +string details
        +string ip_address
        +user() BelongsTo
    }

    User "1" --> "0..*" Wishlist : possede
    User "1" --> "0..*" Review : ecrit
    User "1" --> "0..*" ActivityLog : genere
    Product "1" --> "0..*" Review : recoit
    Product "1" --> "0..*" OrderItem : inclus dans
    Product "1" --> "0..*" Wishlist : liste dans
    Product "0..*" --> "1" Category : appartient a
    Product "0..*" --> "0..1" Seller : vendu par
    Category "0..1" --> "0..*" Category : parent de
    Seller "1" --> "0..*" Product : propose
    Seller "1" --> "0..*" SubOrder : traite
    Order "1" --> "1..*" OrderItem : contient
    Order "1" --> "0..*" SubOrder : divise en
    SubOrder "0..*" --> "1" Order : appartient a
    SubOrder "0..*" --> "1" Seller : traite par
    SubOrder "1" --> "0..*" OrderItem : regroupe
    OrderItem "0..*" --> "1" Product : reference
```

---

### 🔄 Diagramme de Séquence – Passer une Commande

```mermaid
sequenceDiagram
    actor Client
    participant React as React SPA
    participant Nginx as Nginx
    participant Laravel as Laravel API
    participant MySQL as MySQL
    participant Redis as Redis
    participant Queue as Queue Worker
    participant Email as Email

    Note over Client,Email: Flux Complet - Passer une Commande

    Client->>React: Parcourt le catalogue
    React->>Nginx: GET /api/products?page=1
    Nginx->>Laravel: Proxy fastcgi
    Laravel->>MySQL: SELECT products avec filtres
    MySQL-->>Laravel: JSON produits pagines
    Laravel-->>React: 200 data + meta + links
    React-->>Client: Affichage catalogue

    Client->>React: Ajoute produit au panier
    React->>React: CartContext.addItem localStorage
    React-->>Client: Panier mis a jour

    Client->>React: Valide commande au checkout
    React->>Nginx: POST /api/orders
    Nginx->>Laravel: Proxy fastcgi
    Laravel->>Laravel: Valide donnees + calcule totaux
    Laravel->>MySQL: BEGIN TRANSACTION
    Laravel->>MySQL: INSERT orders status=pending
    MySQL-->>Laravel: order_id = 42

    loop Pour chaque article du panier
        Laravel->>MySQL: INSERT order_items
        Laravel->>MySQL: UPDATE products SET stock = stock - qty
    end

    loop Pour chaque vendeur unique
        Laravel->>MySQL: INSERT sub_orders
        Laravel->>MySQL: UPDATE order_items SET sub_order_id
    end

    Laravel->>MySQL: COMMIT TRANSACTION
    MySQL-->>Laravel: Transaction OK

    Laravel->>MySQL: UPDATE orders SET secure_token=64hex
    Laravel->>Redis: PUSH job SendOrderConfirmationEmail
    Laravel-->>React: 201 Created order + secure_token
    React-->>Client: Page confirmation commande

    Note over Queue,Email: Traitement asynchrone

    Queue->>Redis: POP job
    Queue->>Email: Email confirmation client
    Queue->>Email: Notification admin
    Email-->>Client: Email Commande confirmee
```

---

### 🔑 Diagramme de Séquence – Authentification OTP

```mermaid
sequenceDiagram
    actor User as Utilisateur
    participant React as React SPA
    participant Laravel as Laravel API
    participant MySQL as MySQL
    participant Queue as Queue Worker
    participant Email as Email

    Note over User,Email: Inscription + Verification Email OTP

    User->>React: Remplit formulaire inscription
    React->>Laravel: POST /api/register throttle 3/min
    Laravel->>MySQL: INSERT users email_verified=false role=customer
    MySQL-->>Laravel: user_id = 15
    Laravel->>MySQL: DELETE otps WHERE email + type verification
    Laravel->>MySQL: INSERT otps code=6chiffres expires_at=+10min
    Laravel->>Queue: PUSH job SendOtpEmail
    Queue->>Email: Email OTP vers utilisateur
    Laravel-->>React: 201 Compte cree - Verifiez votre email
    React-->>User: Page verification OTP affichee

    User->>React: Saisit code OTP recu par email
    React->>Laravel: POST /api/otp/verify-email email + code

    Laravel->>MySQL: SELECT otps WHERE email + code + used=false
    MySQL-->>Laravel: OTP trouve

    alt OTP valide non expire
        Laravel->>MySQL: UPDATE otps SET used=true
        Laravel->>MySQL: UPDATE users SET email_verified=true
        Laravel->>MySQL: INSERT personal_access_tokens
        MySQL-->>Laravel: Token Bearer genere
        Laravel-->>React: 200 access_token + user object
        React-->>User: Connecte et verifie avec succes
    else OTP expire ou incorrect
        Laravel-->>React: 422 Code invalide ou expire
        React-->>User: Message d erreur affiche
    end
```

---

### 📊 Diagramme de Séquence – Dashboard Admin

```mermaid
sequenceDiagram
    actor Admin as Admin
    participant React as React Admin SPA
    participant Laravel as Laravel API
    participant MySQL as MySQL
    participant Redis as Redis Cache

    Note over Admin,Redis: Chargement Dashboard KPIs et Stats

    Admin->>React: Acces /admin/dashboard
    React->>React: Verifie AuthContext role=admin
    React->>Laravel: GET /api/admin/stats Bearer Token

    Laravel->>Laravel: Middleware auth:sanctum OK
    Laravel->>Laravel: Middleware admin role=admin OK

    Laravel->>Redis: GET cache:admin_stats
    alt Cache hit moins de 5 minutes
        Redis-->>Laravel: Donnees en cache retournees
    else Cache miss
        Laravel->>MySQL: COUNT(*) FROM orders + SUM total_amount
        Laravel->>MySQL: COUNT(*) FROM products + users + reviews
        Laravel->>MySQL: SELECT orders 30 derniers jours groupe par date
        Laravel->>MySQL: Top 10 products par quantite vendue
        Laravel->>MySQL: Top 10 villes clientes
        Laravel->>MySQL: activity_logs recents LIMIT 10
        MySQL-->>Laravel: Toutes donnees agregees
        Laravel->>Redis: SET cache:admin_stats TTL 5min
    end

    Laravel-->>React: 200 kpis + charts_data + top_products + logs
    React->>React: Render graphiques Recharts/Chart.js
    React-->>Admin: Dashboard interactif affiche

    Admin->>React: Change statut commande 42 a delivered
    React->>Laravel: PATCH /api/admin/orders/42/status delivered
    Laravel->>MySQL: UPDATE orders SET status=delivered WHERE id=42
    Laravel->>MySQL: INSERT activity_logs action=order_status_changed
    Laravel->>Redis: DELETE cache:admin_stats
    Laravel-->>React: 200 order updated
    React-->>Admin: Statut commande mis a jour
```

---

### 🔄 Diagramme d'Activité – Workflow Commande

```mermaid
flowchart TD
    START([Debut]) --> BROWSE[Parcourir catalogue]
    BROWSE --> FILTER{Filtrer produits ?}
    FILTER -->|Oui| APPLY[Appliquer filtres\ncategorie prix etat promo]
    FILTER -->|Non| VIEW
    APPLY --> VIEW[Voir detail produit]

    VIEW --> ADD{Ajouter au panier ?}
    ADD -->|Non| BROWSE
    ADD -->|Oui| CART[Maj CartContext localStorage]

    CART --> MORE{Continuer shopping ?}
    MORE -->|Oui| BROWSE
    MORE -->|Non| CHECKOUT[Acceder checkout]

    CHECKOUT --> AUTH{Utilisateur connecte ?}
    AUTH -->|Non| GUEST[Remplir infos client\nnom email telephone adresse]
    AUTH -->|Oui| PREFILL[Pre-remplissage depuis profil]

    GUEST --> PAY_METHOD[Choisir mode paiement\nCOD ou CB]
    PREFILL --> PAY_METHOD

    PAY_METHOD --> CONFIRM[Confirmer commande]
    CONFIRM --> API_CALL[POST /api/orders]

    API_CALL --> VALID{Validation API\ndonnees et stock OK ?}
    VALID -->|Erreur| ERR[Afficher message erreur]
    ERR --> CHECKOUT

    VALID -->|OK| CREATE_ORDER[Creer Order en BDD\nSTATUS pending]
    CREATE_ORDER --> CREATE_ITEMS[Creer OrderItems\nDeduire stock produits]
    CREATE_ITEMS --> CREATE_SUBS[Creer SubOrders\npar vendeur automatique]
    CREATE_SUBS --> GEN_TOKEN[Generer secure_token\n64 caracteres hex]
    GEN_TOKEN --> QUEUE_EMAILS[Queue - Emails\nclient + admin asynchrone]
    QUEUE_EMAILS --> CONFIRMED[Commande confirmee\nPage succes]

    CONFIRMED --> PAY_NOW{Payer par CB\nmaintenant ?}
    PAY_NOW -->|Non COD| TRACK_ORDER
    PAY_NOW -->|Oui CB| CB_FORM[Formulaire CB\nNumero + Expiry + CVV]

    CB_FORM --> LUHN_CHECK{Algorithme\nLuhn valide ?}
    LUHN_CHECK -->|Non| CB_FORM
    LUHN_CHECK -->|Oui| PROCESS_PAY[POST /api/orders/id/pay]
    PROCESS_PAY --> PAID[Paiement valide\nPDF Receipt genere]
    PAID --> INVOICE_EMAIL[Email Facture PDF\npiece jointe]
    INVOICE_EMAIL --> TRACK_ORDER

    TRACK_ORDER[Suivi commande\nGET /api/orders/id?token=secure_token] --> END([Fin])
```

---

### 🧩 Diagramme de Composants

```mermaid
graph TB
    subgraph BROWSER ["Navigateur Client"]
        subgraph REACT_APP ["React 19 SPA"]
            subgraph CONTEXTS ["React Contexts - State Global"]
                AUTH_CTX[AuthContext\nUser + Bearer Token]
                CART_CTX[CartContext\nlocalStorage persistence]
                THEME_CTX[ThemeContext\nDark Light mode]
                LANG_CTX[LanguageContext\ni18next 4 langues]
                WISH_CTX[WishlistContext\nFavoris utilisateur]
                COMP_CTX[CompareContext\nComparateur produits]
            end

            subgraph PAGES_GRP ["Pages React.lazy + Suspense"]
                PUB[Pages Publiques\nHome Shop Product Track]
                CLI[Pages Client\nCheckout Wishlist Account]
                ADM[Pages Admin\nDashboard Products Orders]
            end

            subgraph COMPS ["Composants UI"]
                HEADER[Header + MegaMenu\nGSAP animations]
                DRAWER[CartDrawer\nGSAP slide animation]
                CARD[ProductCard\nSkeleton Lazy Image]
                THREE_D[Three.js Viewer\n3D Product Viewer]
                BOT[SmartAssistant\nChatbot modal]
                WA[WhatsApp Button\nFlottant fixe]
            end

            subgraph SVC ["Services Axios"]
                API_SVC[apiService\nAxios + Bearer Token interceptor]
                IMG_SVC[imageService\nURL management]
            end
        end
    end

    subgraph INFRA ["Infrastructure Docker"]
        subgraph FN ["electro_frontend network"]
            NGINX_P[Nginx :8080\nReverse Proxy\nGzip + Headers]
            REACT_S[Node.js :3000\nDev HMR ou Static]
        end

        subgraph BN ["electro_backend network"]
            LARAVEL_A[Laravel 12\nPHP-FPM :9000\nOpcache]
            QUEUE_W[Queue Worker\nRedis job listener]
            SCHED_S[Scheduler\nCron tasks artisan]
        end

        subgraph DATA ["Data Layer"]
            MYSQL_D[(MySQL 8.0\n13 tables metier)]
            REDIS_D[(Redis 7\nCache + Sessions + Jobs)]
        end

        subgraph DEV_T ["Dev Tools only"]
            MAILPIT_S[Mailpit\nSMTP :1025\nUI :8025]
            PHPMYADMIN_S[phpMyAdmin\n:8888]
        end
    end

    API_SVC -->|HTTP Axios| NGINX_P
    NGINX_P -->|/api/ fastcgi| LARAVEL_A
    NGINX_P -->|/ proxy| REACT_S
    LARAVEL_A --> MYSQL_D
    LARAVEL_A --> REDIS_D
    QUEUE_W --> REDIS_D
    QUEUE_W --> MAILPIT_S
    SCHED_S --> LARAVEL_A
    PHPMYADMIN_S --> MYSQL_D
```

---

### 🚀 Diagramme de Déploiement Docker

```mermaid
graph TB
    subgraph HOST ["Machine Hote - Ports exposes"]
        P8080["Port 8080 HTTP"]
        P443["Port 443 HTTPS prod"]
        P8888["Port 8888 phpMyAdmin"]
        P8025["Port 8025 Mailpit UI"]
        P3307["Port 3307 MySQL ext"]
    end

    subgraph FN ["Network: electro_frontend"]
        NGINX_D["nginx:1.25-alpine\nPort 80 443\nReverse Proxy\nGzip Security Headers SSL"]
        REACT_D["node:20-alpine\nPort 3000\nDev: Vite HMR\nProd: Static build"]
    end

    subgraph BN ["Network: electro_backend"]
        LARAVEL_D["php:8.2-fpm-alpine\nPort 9000\nLaravel 12 API\nOpcache activee"]
        QUEUE_D["php:8.2-fpm-alpine\nQueue Worker\nphp artisan queue:work"]
        SCHED_D["php:8.2-fpm-alpine\nScheduler\nphp artisan schedule:run"]
        MYSQL_D["mysql:8.0\nPort 3306\nInnoDB utf8mb4\n20+ tables"]
        REDIS_D["redis:7-alpine\nPort 6379\nCache Sessions\nQueue AOF persist"]
        PHPMY_D["phpmyadmin\nPort 80\nDev Only"]
        MAIL_D["axllent/mailpit\nPort 1025 SMTP\nPort 8025 Web UI\nDev Only"]
    end

    subgraph VOLS ["Volumes Persistants"]
        VM[mysql-data]
        VR[redis-data]
        VS[laravel-storage]
        VF[laravel-framework]
        VB[react-build]
    end

    P8080 --> NGINX_D
    P443 --> NGINX_D
    P8888 --> PHPMY_D
    P8025 --> MAIL_D
    P3307 --> MYSQL_D

    NGINX_D --> REACT_D
    NGINX_D --> LARAVEL_D
    LARAVEL_D --> MYSQL_D
    LARAVEL_D --> REDIS_D
    QUEUE_D --> REDIS_D
    QUEUE_D --> MYSQL_D
    QUEUE_D --> MAIL_D
    SCHED_D --> LARAVEL_D
    PHPMY_D --> MYSQL_D

    MYSQL_D --> VM
    REDIS_D --> VR
    LARAVEL_D --> VS
    LARAVEL_D --> VF
    REACT_D --> VB
```

---

### 🗃️ Diagramme Entité-Relation (ERD)

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password
        varchar role
        varchar phone
        varchar city
        text address
        text avatar
        varchar google_id UK
        boolean email_verified
        timestamp email_verified_at
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES {
        bigint id PK
        varchar name
        varchar slug UK
        varchar image
        bigint parent_id FK
        timestamp created_at
        timestamp updated_at
    }

    SELLERS {
        bigint id PK
        varchar name
        varchar city
        varchar email
        varchar logo
        int prep_days
        timestamp created_at
        timestamp updated_at
    }

    PRODUCTS {
        bigint id PK
        bigint category_id FK
        bigint seller_id FK
        varchar name
        varchar slug UK
        text description
        decimal price
        decimal old_price
        varchar image
        longtext images
        int stock
        boolean is_featured
        enum state
        int promo
        varchar delivery_type
        timestamp created_at
        timestamp updated_at
    }

    ORDERS {
        bigint id PK
        varchar customer_name
        varchar customer_email
        varchar customer_phone
        text customer_address
        varchar customer_city
        text order_notes
        decimal total_amount
        decimal refunded_amount
        varchar status
        varchar secure_token UK
        boolean email_sent
        varchar assigned_agent
        varchar payment_method
        varchar payment_status
        boolean acompte_paid
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint sub_order_id FK
        bigint product_id FK
        int quantity
        decimal price
        timestamp created_at
        timestamp updated_at
    }

    SUB_ORDERS {
        bigint id PK
        bigint order_id FK
        bigint seller_id FK
        decimal subtotal
        varchar status
        varchar delivery_estimate
        timestamp created_at
        timestamp updated_at
    }

    REVIEWS {
        bigint id PK
        bigint product_id FK
        bigint user_id FK
        int rating
        varchar title
        text body
        boolean verified_purchase
        boolean approved
        timestamp created_at
        timestamp updated_at
    }

    WISHLISTS {
        bigint id PK
        bigint user_id FK
        bigint product_id FK
        timestamp created_at
        timestamp updated_at
    }

    OTPS {
        bigint id PK
        varchar email
        varchar code
        varchar type
        boolean used
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    MAGIC_LINKS {
        bigint id PK
        varchar email
        varchar token UK
        timestamp expires_at
        timestamp used_at
        timestamp created_at
        timestamp updated_at
    }

    LOCATIONS {
        bigint id PK
        varchar name
        varchar city
        varchar address
        decimal latitude
        decimal longitude
        varchar type
        timestamp created_at
        timestamp updated_at
    }

    ACTIVITY_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action
        varchar target_type
        varchar target_id
        text details
        varchar ip_address
        timestamp created_at
        timestamp updated_at
    }

    CATEGORIES ||--o{ CATEGORIES : "parent vers enfant"
    CATEGORIES ||--o{ PRODUCTS : "contient"
    SELLERS ||--o{ PRODUCTS : "vend"
    SELLERS ||--o{ SUB_ORDERS : "traite"
    PRODUCTS ||--o{ ORDER_ITEMS : "inclus dans"
    PRODUCTS ||--o{ REVIEWS : "recoit"
    PRODUCTS ||--o{ WISHLISTS : "dans"
    ORDERS ||--o{ ORDER_ITEMS : "contient"
    ORDERS ||--o{ SUB_ORDERS : "divise en"
    SUB_ORDERS ||--o{ ORDER_ITEMS : "regroupe"
    USERS ||--o{ REVIEWS : "ecrit"
    USERS ||--o{ WISHLISTS : "possede"
    USERS ||--o{ ACTIVITY_LOGS : "genere"
```

---

## 📧 Notifications Email

10 templates transactionnels Blade — traités **de façon asynchrone** via Redis Queue Worker :

| Template | Déclencheur | Destinataire | Contenu |
|----------|-------------|--------------|---------|
| `otp.blade.php` | Inscription / Reset password | Client | Code OTP 6 chiffres + expiration |
| `order-confirmation.blade.php` | Nouvelle commande créée | Client | Récapitulatif + token suivi |
| `order-status.blade.php` | Changement statut commande | Client | Nouveau statut + lien suivi |
| `order-admin.blade.php` | Nouvelle commande créée | Admin | Détails client + articles |
| `invoice.blade.php` | Paiement CB confirmé | Client | Facture PDF en pièce jointe |
| `magiclink.blade.php` | Demande magic link | Client | Lien connexion valable 15 min |
| `contact-form.blade.php` | Message contact envoyé | Admin | Message complet + infos contact |
| `contact-confirmation.blade.php` | Message contact envoyé | Client | Accusé de réception |
| `contact-admin.blade.php` | Message contact | Admin | Notification email |
| `contact-message.blade.php` | Message contact | Admin | Copie du message reçu |

---

## 🔐 Sécurité

| Mesure | Implémentation | Détail |
|--------|----------------|--------|
| **Auth API** | Laravel Sanctum | Tokens Bearer révocables par session |
| **Contrôle accès** | Middleware `admin` | Vérifie `role === 'admin'` |
| **Email vérification** | Middleware `verified.email` | Vérifie `email_verified === true` |
| **Rate Limiting** | Laravel Throttle | Login:5/min, Register:3/min, Contact:3/min |
| **Validation** | `$request->validate()` | Règles strictes sur tous les endpoints |
| **Headers sécurité** | Nginx | X-Frame-Options, X-Content-Type-Options, X-XSS-Protection |
| **reCAPTCHA** | Google v2 | Sur formulaire de connexion |
| **Hashage password** | Bcrypt | `Hash::make()` Laravel natif |
| **Tokens sécurisés** | SHA256 | Magic links + secure_token commandes 64 hex |
| **Logs activité** | ActivityLog model | Actions admin journalisées avec IP |
| **OTP sécurisé** | 6 chiffres | Expiration 10 min, max 3 tentatives, usage unique |
| **Injection SQL** | Eloquent ORM | Requêtes préparées automatiques |

---

## ⚡ Performance

| Optimisation | Technologie | Impact |
|-------------|-------------|--------|
| **Cache queries** | Redis + Laravel Cache | Réduction requêtes BDD répétitives |
| **Files d'attente** | Redis + Queue Worker | Emails asynchrones non bloquants |
| **Opcache PHP** | PHP Opcache | Compilation PHP en cache (revalidate=0 prod) |
| **Eager Loading** | Laravel `with()` | Élimination problèmes N+1 |
| **Pagination** | Serveur 12 items/page | Transferts JSON réduits |
| **Lazy Loading** | React.lazy + Suspense | Pages chargées à la demande |
| **Code splitting** | Vite + Dynamic import | Bundle JS optimisé par route |
| **Gzip** | Nginx compression | Assets compressés en transit |
| **Cache navigateur** | Cache-Control | Assets statiques 1 an en prod |
| **Sessions Redis** | Redis sessions driver | Sessions ultra-rapides |

---

## 🚀 Installation & Déploiement Docker

### Prérequis

- 🐳 **Docker Desktop 29+** (avec Compose v5)
- 🔧 **Git**

### 🔧 Développement

```bash
# 1. Cloner le projet
git clone <repo-url>
cd 05-Electro-profesionnels

# 2. Configuration automatique (recommandé)
cd docker
bash scripts/docker-setup.sh

# 3. OU manuellement :
cp .env.example .env
# Éditez .env avec vos paramètres

# 4. Lancer les conteneurs (profil dev)
docker compose --profile dev \
  -f docker-compose.yml \
  -f docker-compose.override.yml \
  up -d --build

# 5. Accès
# Frontend  : http://localhost:8080
# phpMyAdmin: http://localhost:8888
# Mailpit   : http://localhost:8025
# MySQL CLI : localhost:3307
```

### 🚀 Production

```bash
cd docker
docker compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  up -d --build
```

### 🔑 Identifiants par Défaut

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| 👑 Admin | chzakaria037@gmail.com | 48Pgvv99 |
| 🛒 Client test | john@example.com | password123 |

---

## 📊 Données de Seed

| Seeder | Données créées |
|--------|---------------|
| `AdminUserSeeder` | 1 admin + 1 client test |
| `LocationSeeder` | 8 localisations (3 agences + 5 points relais) |
| `CategorySeeder` | 9 catégories principales + 30+ sous-catégories |
| `SellerSeeder` | 3 vendeurs (Casablanca, Marrakech, Tanger) |
| `ProductSeeder` | 50+ produits avec images réelles |
| `OrderSeeder` | 8 commandes (3 récentes + 5 historiques) |
| `ReviewSeeder` | Avis sur produits populaires |
| `IphoneSeeder` | iPhone 15 Pro Max, 15 Pro, 14 Pro, 13, 12 Reconditionné |

---

## 🗺️ Pages Frontend

### 🌐 Pages Publiques (sans auth)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Accueil | Hero interactif, marques, deal du jour, catégories |
| `/login` | Connexion | Multi-méthodes (email, Google, Magic Link) |
| `/register` | Inscription | Formulaire + envoi OTP |
| `/verify-otp` | Vérification email | Saisie code OTP 6 chiffres |
| `/forgot-password` | Mot de passe oublié | Envoi OTP reset |
| `/contact` | Contact | Formulaire + carte agences |
| `/faq` | FAQ | Questions fréquentes |
| `/promotions` | Promotions | Offres en cours |
| `/retours` | Politique retours | CGV retours |
| `/conditions` | CGV | Conditions générales |
| `/track/:id` | Suivi commande | Timeline statut (token requis) |

### 🔐 Pages Client (auth + email vérifié)

| Route | Page | Description |
|-------|------|-------------|
| `/shop` | Catalogue | Filtres, pagination, tri |
| `/shop/:cat/:sub` | Catégorie | Filtres contextuels |
| `/product/:id` | Détail produit | Avis, 3D viewer, produits similaires |
| `/checkout` | Checkout | Formulaire adresse + résumé panier |
| `/payment/:id` | Paiement CB | Formulaire sécurisé + validation Luhn |
| `/wishlist` | Favoris | Liste produits wishlistés |
| `/comparison` | Comparateur | Tableau comparatif 3 produits |
| `/account` | Mon compte | Profil, commandes, paramètres |
| `/support` | Support | FAQ + contact + assistant |

### 👑 Pages Admin (auth + role admin)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/dashboard` | Dashboard | KPIs, graphiques, logs récents |
| `/admin/products` | Produits | Tableau + export XLSX |
| `/admin/products/new` | Nouveau produit | Formulaire complet |
| `/admin/products/edit/:id` | Modifier produit | Formulaire pré-rempli |
| `/admin/orders` | Commandes | Tableau + filtres + actions status/paiement |
| `/admin/categories` | Catégories | Gestion arborescence |
| `/admin/users` | Utilisateurs | Liste clients inscrits |

---

## 🔮 Améliorations Futures

| Amélioration | Description | Priorité |
|-------------|-------------|----------|
| 💳 **Paiement réel** | Intégration API CMI / Stripe | Haute |
| 📱 **Application Mobile** | React Native ou PWA | Haute |
| 🔔 **Notifications push** | WebSockets + Laravel Echo | Moyenne |
| 🤖 **Recommandations IA** | Suggestions personnalisées ML | Moyenne |
| 📊 **Analytics avancés** | Google Analytics / Matomo | Moyenne |
| 🚚 **Tracking live** | Suivi colis temps réel | Moyenne |
| ⭐ **Programme fidélité** | Points + réductions | Basse |
| 🌐 **Multi-boutique** | Plusieurs magasins virtuels | Basse |
| 🔍 **Elasticsearch** | Recherche full-text avancée | Basse |
| 📦 **PWA** | Progressive Web App offline | Basse |

---

## 👨‍💻 Auteur

<div align="center">

<img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Man%20technologist/3D/man_technologist_3d.png" width="90"/>

### **Zakaria Chamekh**

🎓 Développement Web & Applications
💼 Full Stack Junior – React · Laravel · Docker

📫 *Disponible pour stage / opportunité professionnelle*

[![Email](https://img.shields.io/badge/Email-chzakaria037%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:chzakaria037@gmail.com)

</div>

---

<div align="center">

### ✨ *Electro-05 – Build once. Scale everywhere.* ✨

**React 19 · Laravel 12 · MySQL 8 · Redis 7 · Docker · Nginx**

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer"/>

</div>
