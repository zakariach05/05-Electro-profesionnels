# Spécifications Fonctionnelles Détaillées (Cahier des Charges)
**Projet :** Electro-05 (05-Electro-profesionnels)
**Type :** Plateforme E-commerce High-Tech (Architecture Headless)
**Objectif Principal :** Fournir une application e-commerce moderne, performante et scalable pour des produits électroniques sur le marché marocain.

---

## 🏗️ 1. Architecture Globale & Technologies

L'application repose sur une **Architecture Headless** conteneurisée, séparant complètement le Front-end du Back-end via des API RESTful.

| Couche | Technologie | Version |
|--------|-------------|---------|
| **Frontend** | React.js (SPA) | 19 |
| **Styling** | Tailwind CSS + SCSS | – |
| **Animations** | GSAP + Three.js | – |
| **État global** | React Context API (6 contexts) | – |
| **i18n** | i18next (fr, en, ar, es) | – |
| **Backend** | Laravel (API REST) | 12 |
| **Auth** | Laravel Sanctum (tokens Bearer) | – |
| **Base de données** | MySQL | 8.0 |
| **Cache/Queue** | Redis | 7 |
| **Reverse proxy** | Nginx | 1.25 |
| **Conteneurisation** | Docker Compose | V5 |
| **Email (dev)** | Mailpit | – |
| **Email (prod)** | SMTP Gmail | – |

---

## 🧩 2. Modules Fonctionnels

Le système comporte **6 modules majeurs** :

| Module | Priorité | Acteurs |
|--------|----------|---------|
| **1. Authentification & Utilisateurs** | Critique | Client, Admin |
| **2. Catalogue & Produits** | Critique | Tous |
| **3. Panier, Commande & Paiement** | Critique | Client |
| **4. Dashboard Administration** | Critique | Admin |
| **5. Support Client & Informations** | Haute | Client |
| **6. Infrastructure & Déploiement** | Haute | Admin |

---

### Module 1 : Authentification & Utilisateurs

| Fonctionnalité | Rôle | Priorité | Acteurs |
|----------------|------|----------|---------|
| **Inscription & Connexion** | Création de compte et identification par email/mot de passe | Critique | Client, Admin |
| **Login Magic Link** | Connexion sans mot de passe via lien email | Haute | Client |
| **Google OAuth** | Connexion via compte Google (token) | Haute | Client |
| **Vérification Email OTP** | Validation de l'email par code à 6 chiffres | Haute | Client |
| **Réinitialisation mot de passe OTP** | Reset via code email | Haute | Client |
| **Gestion du Profil** | Mise à jour nom, téléphone, ville, adresse, avatar, mot de passe | Moyenne | Client |
| **Administration utilisateurs** | Liste des utilisateurs (admin) | Basse | Admin |

#### Spécifications détaillées

**1.1 Inscription (`POST /api/register`)**
- **Rate limit :** 3 requêtes/minute
- **Entrée :** name, email, password
- **Sortie :** "Compte créé. Vérifiez votre email pour le code OTP."
- **Règles :** Email unique, mot de passe >= 6 caractères, rôle par défaut "customer"

**1.2 Connexion (`POST /api/login`)**
- **Rate limit :** 5 requêtes/minute
- **Entrée :** email, password
- **Sortie :** access_token, token_type, user (id, name, email, role, etc.)
- **Règles :** Compte vérifié ou non indifférent pour login (blocage levé pour OTP)

**1.3 Google OAuth (`POST /api/auth/google`)**
- **Entrée :** Credential token Google
- **Sortie :** access_token, user
- **Règles :** Création auto si nouvel utilisateur, google_id unique

**1.4 Magic Link (`POST /api/auth/magic-link`)**
- **Entrée :** email
- **Sortie :** Email avec lien unique (15 min)
- **Règles :** Token SHA256 à usage unique, expiration 15 min

**1.5 OTP Email (`POST /api/otp/send-verification` / `POST /api/otp/verify-email`)**
- **Entrée :** email (send), email + code (verify)
- **Sortie :** Token Bearer + "Email vérifié avec succès"
- **Règles :** Code 6 chiffres, valable 10 min, max 3 tentatives

**1.6 Profil (`GET /api/user`, `PUT /api/user`, `POST /api/user/change-password`)**
- **Auth :** Sanctum Bearer token
- **Champs modifiables :** name, phone, city, address
- **Avatar :** URL nullable

**1.7 Logout (`POST /api/logout`)**
- **Auth :** Sanctum
- **Action :** Révocation du token courant

---

### Module 2 : Catalogue & Produits

| Fonctionnalité | Rôle | Priorité | Acteurs |
|----------------|------|----------|---------|
| **Navigation & Filtres** | Parcourir, filtrer et paginer les produits | Critique | Tous |
| **Détail produit** | Fiche produit complète (prix, images, description, état) | Critique | Tous |
| **Arborescence catégories** | Catégories parent/enfant avec navigation | Critique | Tous |
| **Recherche** | Recherche par nom de produit | Haute | Tous |
| **Wishlist** | Sauvegarde de produits favoris (connecté) | Moyenne | Client |
| **Comparateur** | Comparaison jusqu'à 3 produits | Moyenne | Client |
| **Avis & Notes** | Notation 1-5 étoiles avec modération admin | Haute | Client, Admin |
| **Multi-vendeurs** | Produits assignés à des vendeurs, sous-commandes | Normale | Admin, Système |

#### Spécifications détaillées

**2.1 Catalogue (`GET /api/products`)**
- **Filtres :** category_id (récursif), search, price_min/price_max, state (neuf/occasion/reconditionne), brand, promo, is_featured, in_stock
- **Pagination :** 12 produits/page via `?page=N`
- **Tri :** created_at DESC par défaut
- **Champs :** id, name, slug, description, price, old_price, image, images (JSON), stock, state, promo, delivery_type, category, seller, is_wished (si connecté)

**2.2 Catégories (`GET /api/categories`)**
- **Structure :** Arborescence parent → enfants avec récursion 3 niveaux
- **Champs :** id, name, slug, image, children

**2.3 Wishlist (`GET/POST/DELETE /api/wishlist`)**
- **Auth :** Sanctum + email vérifié
- **Endpoints :** list (GET), toggle (POST), remove (DELETE /{id}), clear (DELETE)
- **Toggle :** Si déjà présent → supprime, sinon → ajoute

**2.4 Comparateur (client-side uniquement)**
- **Stockage :** localStorage via CompareContext
- **Limite :** 3 produits maximum
- **Interface :** Barre fixe en bas + page dédiée

**2.5 Avis (`GET /api/products/{id}/reviews`, `POST /api/products/{id}/reviews`)**
- **Auth GET :** Public (avis approuvés uniquement)
- **Auth POST :** Sanctum + email vérifié
- **Contrainte :** 1 avis par utilisateur par produit
- **Modération :** Admin peut approuver/désapprouver

**2.6 Multi-vendeurs**
- **Sellers :** Nom, ville, email, logo, délai préparation
- **SubOrders :** Découpage automatique d'une commande par vendeur
- **Délais livraison :** Calcul basé sur ville vendeur + ville client + type livraison

---

### Module 3 : Panier, Commande & Paiement

| Fonctionnalité | Rôle | Priorité | Acteurs |
|----------------|------|----------|---------|
| **Gestion du Panier** | Ajout/retrait/modification quantité (client-side) | Critique | Client |
| **Checkout** | Tunnel de commande avec adresse de livraison | Critique | Client |
| **Création commande** | Conversion panier → commande en base | Critique | Client, Système |
| **Paiement virtuel** | Simulation paiement CB avec validation Luhn | Haute | Client |
| **Sous-commandes** | Découpage automatique par vendeur | Haute | Système |
| **Facture PDF** | Téléchargement reçu PDF | Moyenne | Client |
| **Suivi commande** | Consultation par token sécurisé | Haute | Client |

#### Spécifications détaillées

**3.1 Panier (client-side)**
- **Stockage :** localStorage via CartContext
- **Fonctions :** addItem, removeItem, updateQuantity, clear, getTotal, getCount
- **Persistance :** Survie au rafraîchissement navigateur
- **Frais livraison :** 100 DH fixes
- **Acompte :** 100 DH pour réservation

**3.2 Création commande (`POST /api/orders`)**
- **Auth :** Optionnelle (guest autorisé)
- **Entrée :** items (product_id + quantity), customer_name, customer_email, customer_phone, customer_address, customer_city, payment_method, order_notes
- **Sortie :** JSON commande + secure_token
- **Actions :** Création Order → création OrderItems → création SubOrders par vendeur → déduction stock
- **secure_token :** Chaîne 64 caractères hexadécimaux, unique

**3.3 Paiement (`POST /api/orders/{id}/pay`)**
- **Auth :** Sanctum
- **Entrée :** card_number (16 chiffres), expiry (MM/YY), cvv
- **Validation :** Luhn (désactivable), date non expirée, CVV 3-4 chiffres
- **Sortie :** "Paiement réussi" + téléchargement reçu

**3.4 Reçu PDF (`GET /api/orders/{id}/receipt`)**
- **Auth :** Optionnelle (via secure_token en query ?token=)
- **Format :** PDF généré par DomPDF sur template Blade
- **Contenu :** Logo, infos client, articles, totaux, statut

**3.5 Suivi commande (`GET /api/orders/{id}?token=xxx`)**
- **Auth :** Optionnelle (token sécurisé)
- **Sortie :** Statut, articles, sous-commandes, statuts paiement

---

### Module 4 : Dashboard Administration

| Fonctionnalité | Rôle | Priorité | Acteurs |
|----------------|------|----------|---------|
| **Dashboard Statistiques** | KPIs, graphiques revenus, commandes, stocks | Critique | Admin |
| **CRUD Produits** | Ajout/modification/suppression produits | Critique | Admin |
| **CRUD Catégories** | Gestion arborescence catégories | Critique | Admin |
| **Gestion Commandes** | Statut, paiement, remboursement, assignation | Critique | Admin |
| **Gestion Avis** | Modération des avis clients | Haute | Admin |
| **Export données** | CSV/XLSX produits et commandes | Haute | Admin |
| **Liste utilisateurs** | Visualisation des clients inscrits | Basse | Admin |

#### Spécifications détaillées

**4.1 Dashboard (`GET /api/admin/stats`)**
- **KPIs :** Total commandes, revenu total, nb produits, nb utilisateurs, nb avis
- **Commandes :** Aujourd'hui, en retard, en attente, en cours
- **Stocks :** Produits faibles stocks (<=5), produits en rupture
- **Graphiques :** Revenus 30 jours (barres avec jours sans trous), répartition paiements (paid/unpaid/refunded), statuts commandes
- **Top ventes :** Top 10 produits les plus vendus
- **Utilisateurs :** Nouveaux utilisateurs (30 jours)
- **Géographie :** Top 10 villes clientes
- **Activité :** Logs d'activité récents
- **Mensuel :** Revenu mois courant vs mois précédent avec % croissance

**4.2 Gestion Commandes (`GET /api/admin/orders`)**
- **Liste :** Toutes commandes paginées avec filtres (statut, date, recherche)
- **Actions :**
  - `PATCH /api/admin/orders/{id}/status` → pending/processing/paid/completed/cancelled/delivered
  - `PATCH /api/admin/orders/{id}/assign` → assigner agent livreur
  - `PATCH /api/admin/orders/{id}/payment` → paid/unpaid/refunded
  - `POST /api/admin/orders/{id}/refund` → remboursement partiel/total
  - `POST /api/admin/orders/{id}/resend-invoice` → renvoi facture email

**4.3 CRUD Produits (`POST/PUT/DELETE /api/products`)**
- **Champs :** name, slug, description, price, old_price, image, images (JSON), stock, category_id, seller_id, state, promo, delivery_type, is_featured
- **Validation :** Prix > 0, stock >= 0, images URL valides

**4.4 CRUD Catégories (`POST/PUT/DELETE /api/categories`)**
- **Champs :** name, slug, image, parent_id
- **Structure :** Parent → enfants récursifs

**4.5 Export (`GET /api/admin/products/export`, `GET /api/admin/orders/export`)**
- **Formats :** CSV (point-virgule, UTF-8 BOM), XLSX (Maatwebsite)
- **Produits :** Nom, SKU, catégorie, prix, stock, état, promo, vendeur
- **Commandes :** ID, client, email, téléphone, ville, total, statut, paiement, date
- **Client-side (React) :** Export ExcelJS avec mise en forme conditionnelle

---

### Module 5 : Support Client & Informations

| Fonctionnalité | Rôle | Priorité | Acteurs |
|----------------|------|----------|---------|
| **Formulaire de Contact** | Envoi message à l'admin avec confirmation | Haute | Client |
| **Pages Informatives** | FAQ, CGV, Politique Retours, Promotions | Normale | Client |
| **Suivi de Commande** | Consultation par token sans auth | Haute | Client |
| **Agences physiques** | Carte interactive des branches et relais | Basse | Client |
| **Assistant intelligent** | Guide d'achat par questions/réponses chatbot | Moyenne | Client |
| **WhatsApp** | Bouton flottant de contact direct | Basse | Client |

#### Spécifications détaillées

**5.1 Contact (`POST /api/contact`)**
- **Rate limit :** 3 requêtes/minute
- **Entrée :** name, email, subject, message
- **Sortie :** "Message envoyé avec succès"
- **Emails :** Notification admin + confirmation client

**5.2 Suivi commande (`GET /track/:id`)**
- **Auth :** Aucune (token sécurisé requis)
- **Interface :** Timeline logistique du statut
- **Données :** Statut, articles, montant, date commande

**5.3 Assistant intelligent**
- **Interface :** Chatbot modal avec questions à choix
- **Logique :** Questions → réponses → suggestion produit correspondant
- **Thématique :** Catégories Electronique (PC, Smartphone, Gaming…)

**5.4 Carte interactive**
- **Données :** 8 localisations (3 agences Casablanca, 5 points relais)
- **Technologie :** Composant React avec marqueurs de localisation

---

### Module 6 : Infrastructure & Déploiement

| Fonctionnalité | Rôle | Priorité |
|----------------|------|----------|
| **Conteneurisation Docker** | 9 conteneurs orchestrés | Critique |
| **Développement** | Hot-reload, bind mounts, dev profile | Haute |
| **Production** | SSL, HTTPS, builds optimisés | Haute |
| **Backup BDD** | Script de dump MySQL automatisé | Moyenne |
| **Healthchecks** | Surveillance état des services | Haute |
| **Logs** | PHP-FPM logs fichier, Nginx logs | Moyenne |

#### Spécifications détaillées

**6.1 Services Docker**

| Conteneur | Image | Ports | Rôle |
|-----------|-------|-------|------|
| nginx | nginx:1.25-alpine | 8080:80, 443:443 | Reverse proxy unique |
| react | node:20-alpine | 3000 | SPA React (dev HMR / build statique) |
| laravel | php:8.2-fpm-alpine | 9000 | API PHP-FPM |
| mysql | mysql:8.0 | 3307:3306 | Base de données |
| redis | redis:7-alpine | 6379 | Cache + Queue + Sessions |
| phpmyadmin | phpmyadmin:latest | 8888:80 | Gestion BDD (dev) |
| queue-worker | php:8.2-fpm-alpine | – | File d'attente Redis |
| scheduler | php:8.2-fpm-alpine | – | Tâches planifiées |
| mailpit | axllent/mailpit | 8025:8025, 1025:1025 | SMTP dev (dev) |

**6.2 Réseaux**
- `electro_frontend` : nginx + react
- `electro_backend` : nginx + laravel + mysql + redis + phpmyadmin + queue-worker + scheduler

**6.3 Volumes persistants**
- `mysql-data` : Données MySQL
- `redis-data` : AOF Redis
- `laravel-storage` : Logs, uploads, exports
- `laravel-framework` : bootstrap/cache
- `react-build` : Build production React

---

## 🗄️ 3. Structure de la Base de Données

### Tables Métier (13)

| Table | Rôle | Relations |
|-------|------|-----------|
| `users` | Comptes clients + admin | → orders, reviews, wishlists, otps, magic_links, activity_logs |
| `categories` | Arborescence catégories (parent/enfant) | → categories.parent_id, products |
| `products` | Catalogue produits | → categories, sellers |
| `orders` | Commandes clients | → order_items, sub_orders |
| `order_items` | Articles d'une commande | → orders, products, sub_orders |
| `sellers` | Vendeurs / préparateurs | → products, sub_orders |
| `sub_orders` | Sous-commandes par vendeur | → orders, sellers, order_items |
| `reviews` | Avis clients modérés | → products, users |
| `wishlists` | Favoris utilisateurs | → users, products |
| `otps` | Codes OTP email | → users (via email) |
| `magic_links` | Tokens connexion sans mot de passe | → users (via email) |
| `locations` | Agences et points relais | – |
| `activity_logs` | Journalisation actions admin | → users |

### Tables Système (7)
`personal_access_tokens`, `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`

---

## 🎨 4. Interface Utilisateur (Frontend)

### Pages Publiques (sans auth)
| Route | Page | Composants clés |
|-------|------|-----------------|
| `/` | Accueil | InteractiveHero, BrandsMarquee, DealOfTheDay, CategoriesGrid, SplashScreen |
| `/login` | Connexion | LoginModal, MagicLogin, Google OAuth |
| `/register` | Inscription | Formulaire inscription |
| `/verify-otp` | Vérification email | Saisie code OTP |
| `/forgot-password` | Mot de passe oublié | Envoi OTP reset |
| `/contact` | Contact | Formulaire contact + carte |
| `/faq` | FAQ | Questions fréquentes |
| `/promotions` | Promotions | Offres en cours |
| `/retours` | Politique retours | CGV retours |
| `/conditions` | CGV | Conditions générales |
| `/track/:id` | Suivi commande | Timeline statut + infos |

### Pages Client (auth + email vérifié)
| Route | Page | Composants clés |
|-------|------|-----------------|
| `/shop` | Catalogue | FilterSidebar, ProductCard, SkeletonLoader |
| `/shop/:cat/:sub` | Catégorie | Filtres contextuels |
| `/product/:id` | Détail produit | ReviewSection, RelatedProducts, Three.js Viewer |
| `/checkout` | Checkout | Formulaire adresse, résumé panier |
| `/payment/:id` | Paiement virtuel | Formulaire CB, validation Luhn |
| `/wishlist` | Favoris | Liste produits wishlistés |
| `/comparison` | Comparateur | Tableau comparatif 3 produits |
| `/account` | Mon compte | Profil, commandes, paramètres |
| `/support` | Support | FAQ + contact + assistant |

### Pages Admin (auth + rôle admin)
| Route | Page | Composants clés |
|-------|------|-----------------|
| `/admin/dashboard` | Dashboard | KPIs, graphiques (Chart.js/Recharts), logs |
| `/admin/products` | Produits | Tableau + export XLSX |
| `/admin/products/new` | Nouveau produit | Formulaire complet |
| `/admin/products/edit/:id` | Modifier produit | Formulaire pré-rempli |
| `/admin/orders` | Commandes | Tableau + filtres + actions |
| `/admin/categories` | Catégories | Gestion arborescence |
| `/admin/users` | Utilisateurs | Liste clients |

### Fonctionnalités Transversales

| Fonctionnalité | Technologie | Description |
|---------------|-------------|-------------|
| Thème Dark/Light | ThemeContext + localStorage | Toggle avec persistance |
| Multilingue | i18next | fr, en, ar (RTL), es |
| Animations | GSAP | Cart drawer, mega menu, transitions |
| Chat WhatsApp | WhatsAppButton | Bouton flottant fixe |
| Assistant IA | SmartAssistant | Chatbot guide d'achat |
| 3D Produits | Three.js | Visionneuse interactive |
| SEO | SEO component | Meta tags par page |
| Splash Screen | SplashScreen | Animation démarrage |
| Lazy loading | React.lazy + Suspense | Toutes les pages chargées à la demande |

---

## 📧 5. Notifications Transactionnelles

### 10 templates email

| Template | Déclencheur | Destinataire |
|----------|-------------|--------------|
| `otp.blade.php` | Envoi code OTP | Client |
| `order-confirmation.blade.php` | Nouvelle commande | Client |
| `order-status.blade.php` | Changement statut | Client |
| `order-admin.blade.php` | Nouvelle commande | Admin (chzakaria037@gmail.com) |
| `invoice.blade.php` | Paiement confirmé | Client (PDF attaché) |
| `magiclink.blade.php` | Demande magic link | Client |
| `contact-form.blade.php` | Message contact reçu | Admin |
| `contact-confirmation.blade.php` | Accusé réception | Client |
| `contact-admin.blade.php` | Notification admin | Admin |
| `contact-message.blade.php` | Copie message admin | Admin |

---

## 🔐 6. Sécurité

| Mesure | Implémentation |
|--------|---------------|
| Authentification API | Laravel Sanctum (tokens Bearer) |
| Contrôle d'accès | Middleware `admin` (vérification `role === 'admin'`) |
| Vérification email | Middleware `verified.email` |
| Rate limiting | Throttle (login:5/min, register:3/min, contact:3/min, OTP:3/60s) |
| Validation entrées | `$request->validate()` avec règles strictes |
| Protection CSRF | Nginx + Laravel (intégré) |
| Headers sécurité | Nginx : X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy |
| reCAPTCHA | Google reCAPTCHA v2 sur formulaire login |
| Hachage mots de passe | Bcrypt (Hash::make) |
| Logs d'activité | Toutes les actions admin journalisées |
| Clés API | APP_KEY généré, tokens SHA256 |

---

## ⚡ 7. Performance

| Optimisation | Implémentation |
|-------------|---------------|
| Cache | Redis (sessions, cache Laravel) |
| Files d'attente | Redis + Queue Worker asynchrone |
| Opcache | PHP Opcache activé (revalidate=0 en production) |
| Eager Loading | Laravel `with()` pour relations N+1 |
| Pagination | Pagination API côté serveur (12 items/page) |
| Lazy Loading | React.lazy() + Suspense pour toutes les pages |
| Images | WebP optimisées, chargement asynchrone |
| Gzip | Compression Nginx activée |
| Cache navigateur | Assets avec long cache (1 an en prod) |

---

## 🔄 8. Workflow Principal

```
1. CLIENT navigue sur React SPA → catalogue filtré via API
2. CLIENT ajoute articles au panier (localStorage)
3. CLIENT remplit checkout (adresse + mode paiement)
4. API LARAVEL crée Order + OrderItems + SubOrders (par seller)
5. API LARAVEL déduit le stock produits
6. EMAIL confirmation envoyé au client
7. EMAIL notification envoyé à l'admin
8. ADMIN modifie statut, assigne livreur, gère paiement
9. CLIENT suit sa commande via token sécurisé
10. CLIENT reçoit email mise à jour statut
```

---

## 🐳 9. Installation & Déploiement

### Développement

```bash
cd docker
cp .env.example .env
docker compose --profile dev -f docker-compose.yml -f docker-compose.override.yml up -d --build
```

**Accès :**
| Service | URL |
|---------|-----|
| Site | http://localhost:8080 |
| phpMyAdmin | http://localhost:8888 |
| Mailpit | http://localhost:8025 |

**Identifiants :**
| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | chzakaria037@gmail.com | 48Pgvv99 |
| Client test | john@example.com | password123 |

### Production

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## 📊 10. Données de Seed

| Seeder | Données |
|--------|---------|
| AdminUserSeeder | 1 admin + 1 client |
| LocationSeeder | 8 localisations (3 agences, 5 points relais) |
| CategorySeeder | 9 catégories principales + 30+ sous-catégories |
| SellerSeeder | 3 vendeurs (Casablanca, Marrakech, Tanger) |
| ProductSeeder | 50+ produits avec images réelles |
| OrderSeeder | 8 commandes (3 récentes + 5 historiques) |
| ReviewSeeder | Avis sur produits populaires |
| IphoneSeeder | iPhone 16, 17, 17e, 17 Air, 17 Pro Max |

---

## 📝 11. Améliorations Futures

| Amélioration | Description |
|-------------|-------------|
| 💳 Paiement réel | Intégration API CMI / Stripe |
| 📱 Application Mobile | React Native ou PWA |
| 🔔 Notifications push | WebSockets + Laravel Echo |
| 🤖 Recommandations IA | Suggestions personnalisées |
| 📊 Analytics avancés | Google Analytics / Matomo |
| 🚚 Tracking live | Suivi colis temps réel |
| ⭐ Programme fidélité | Points + réductions |
| 🌐 Multi-boutique | Plusieurs magasins virtuels |
