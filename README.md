# ⚡ Electro-05 — Plateforme E-commerce High-Tech

> Plateforme e-commerce moderne (B2C) dédiée à la vente de produits électroniques  
> **Stack : React.js + Laravel + MySQL**

---

## 🚀 Aperçu du Projet

Electro-05 est une application web **headless**, performante et évolutive, destinée au marché marocain.  
Elle permet :
- la gestion d’un catalogue produits
- le panier et les commandes
- le suivi des livraisons
- une interface d’administration sécurisée

---

## 🧱 Architecture Globale (Animée)

```mermaid
flowchart LR
    A[🧑‍💻 Client<br/>React SPA]
    B[⚙️ API REST<br/>Laravel]
    C[🗄️ Base de Données<br/>MySQL]

    A <-->|JSON / HTTPS| B
    B <-->|Eloquent ORM| C

sequenceDiagram
    participant U as Utilisateur
    participant R as React SPA
    participant L as API Laravel
    participant D as MySQL

    U->>R: Navigation / Action utilisateur
    R->>L: Requête API (Axios)
    L->>D: Lecture / Écriture données
    D-->>L: Résultat
    L-->>R: Réponse JSON
    R-->>U: Mise à jour UI

sequenceDiagram
    participant C as Client
    participant F as Frontend React
    participant A as API Laravel
    participant DB as MySQL

    C->>F: Clique sur "Commander"
    F->>A: POST /api/orders
    A->>DB: Vérifier stock
    DB-->>A: Stock OK
    A->>DB: Créer Order + OrderItems
    A-->>F: 201 Commande validée
    F-->>C: Confirmation + panier vidé



    🧠 Détails Techniques (Sections interactives)
<details> <summary>🖥️ Frontend — React.js</summary>

SPA (Single Page Application)

React Router pour la navigation

Context API :

AuthContext

CartContext

ThemeContext

Appels API via Axios

Animations avec Framer Motion / GSAP

Design responsive avec Tailwind CSS

</details> <details> <summary>⚙️ Backend — Laravel</summary>

API RESTful

Routes définies dans routes/api.php

Controllers :

ProductController

OrderController

Authentification avec Laravel Sanctum

Middleware (Admin, Auth)

Validation sécurisée des données

</details> <details> <summary>🗄️ Base de Données — MySQL</summary>

ORM Eloquent

Relations :

User → Orders

Order → OrderItems

Category → Products

Migrations pour versionning du schéma

Seeders pour données de test

</details>


📂 Structure des Dossiers
📁 Frontend
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── context/
├── layouts/
├── pages/
├── services/
└── App.js


📁 Backend

app/
├── Http/
│   ├── Controllers/
│   └── Middleware/
├── Models/
database/
├── migrations/
└── seeders/
routes/
└── api.php


🔐 Sécurité & Performance
Sécurité

Authentification Token (Sanctum)

Protection des routes Admin

Validation des entrées utilisateur

Protection CSRF / XSS (Laravel)

Performance

Lazy Loading (React)

Eager Loading (Laravel)

Images optimisées (WebP)

Code splitting




---

## ✅ Ce README inclut
✔ Animations Mermaid  
✔ Sections interactives  
✔ Diagrammes pro  
✔ Niveau **recruteur / soutenance / portfolio**

---

Si tu veux maintenant :
- 🎥 **ajouter un GIF animé**
- 🌐 **adapter pour portfolio web**
- 🇬🇧 **version anglaise**
- ⚛️ **README spécial React ou Laravel**

👉 dis-moi et je te le fais directement 🚀

