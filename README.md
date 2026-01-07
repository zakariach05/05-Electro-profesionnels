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
    Client[Client React SPA]
    API[API REST Laravel]
    DB[Database MySQL]

    Client <-->| JSON / HTTPS | API
    API <-->| Eloquent ORM | DB


sequenceDiagram
    participant User as Utilisateur
    participant Front as Frontend React
    participant Back as API Laravel
    participant DB as MySQL

    User->>Front: Action utilisateur
    Front->>Back: Requête HTTP (Axios)
    Back->>DB: Lecture / écriture
    DB-->>Back: Résultat
    Back-->>Front: Réponse JSON
    Front-->>User: Mise à jour UI


sequenceDiagram
    participant C as Client
    participant F as Frontend
    participant A as API
    participant D as Database

    C->>F: Cliquer sur Commander
    F->>A: POST /api/orders
    A->>D: Vérifier stock
    D-->>A: Stock OK
    A->>D: Créer commande
    A-->>F: 201 Created
    F-->>C: Confirmation commande




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

