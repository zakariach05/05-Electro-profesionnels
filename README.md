

<div align="center">

<img src="https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/Electric%20plug/3D/electric_plug_3d.png" width="120"/>

# ⚡ Electro-05  
### Plateforme E-commerce High-Tech – Architecture Headless

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Laravel](https://img.shields.io/badge/Laravel-10+-FF2D20?logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)
![API](https://img.shields.io/badge/API-REST-green)
![Status](https://img.shields.io/badge/Status-En%20développement-orange)

🚀 **Application e-commerce moderne, performante et scalable**  
📱 Vente de produits électroniques (Smartphones, PC, Gaming…)  
🇲🇦 Ciblée pour le marché marocain  

</div>

---

## 🎥 Aperçu & Animation Conceptuelle

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/212897594-6e4e5d62-52b3-4a2d-bd5d-7b63e0c3a9d4.gif" width="600"/>
</div>

> Interaction fluide entre **React SPA** et **API Laravel** via JSON sécurisé.

---

## 🧠 Présentation du Projet

**Electro-05** est une plateforme **E-commerce B2C** construite selon une **architecture Headless**.  
Le frontend est totalement découplé du backend, garantissant **performance, sécurité et évolutivité**.

### 🎯 Fonctionnalités principales
- 🛍️ Catalogue produits dynamique
- 🛒 Panier et commandes
- 🔐 Authentification sécurisée
- 📦 Suivi des commandes
- 🧑‍💼 Dashboard Admin (CRUD Produits / Commandes)

---

## 🏗️ Architecture Globale

```mermaid
graph LR
A[Client React SPA] -->|JSON / HTTPS| B[API REST Laravel]
B --> C[(MySQL Database)]
````

📌 **Principe**

* React gère l’UI/UX
* Laravel expose les endpoints API
* MySQL stocke les données métier

---

## ⚙️ Stack Technologique

### 🎨 Frontend

* ⚛️ **React.js 18+** – SPA performante
* 🎨 **Tailwind CSS** – UI moderne & responsive
* 🔁 **Axios** – Communication API
* 🎞️ **Framer Motion / GSAP** – Animations premium

🔗 [https://react.dev](https://react.dev)
🔗 [https://tailwindcss.com](https://tailwindcss.com)

---

### 🔧 Backend

* 🧩 **Laravel 10+** – API REST sécurisée
* 🔐 **Laravel Sanctum** – Authentification SPA
* 🗄️ **MySQL** – Base relationnelle

🔗 [https://laravel.com](https://laravel.com)
🔗 [https://laravel.com/docs/sanctum](https://laravel.com/docs/sanctum)
🔗 [https://dev.mysql.com/doc/](https://dev.mysql.com/doc/)

---

## 🗂️ Structure du Projet

### 📁 Frontend (`Front-end/test/src`)

```txt
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
```

### 📁 Backend (`05-Electro-Back-end`)

```txt
app/
├── Http/
│   ├── Controllers/
│   └── Middleware/
├── Models/
routes/
└── api.php
database/
├── migrations/
└── seeders/
storage/
```

---

## 🔄 Fonctionnement : Passer une Commande

```mermaid
sequenceDiagram
User->>React: Clique "Commander"
React->>Laravel API: POST /api/orders
Laravel->>MySQL: Vérification & création commande
MySQL-->>Laravel: Transaction OK
Laravel-->>React: JSON 201 Created
React-->>User: Commande validée 🎉
```

---

## 🔐 Sécurité & Performance

### Sécurité

* ✅ Tokens Bearer (Sanctum)
* ✅ Middleware Admin
* ✅ Validation stricte des entrées
* ✅ Protection CSRF / XSS native Laravel

### Performance

* ⚡ Lazy Loading React
* ⚡ Eager Loading Laravel
* ⚡ Images WebP optimisées

---

## 📈 Évolutivité

✔️ API réutilisable (Web / Mobile)
✔️ Scalabilité indépendante Front / Back
✔️ Facile à déployer sur serveur cloud

---

## 🚀 Installation Locale (Résumé)

```bash
# Backend
composer install
php artisan migrate --seed
php artisan serve

# Frontend
npm install
npm run dev
```

---

## 👨‍💻 Auteur

**Zakaria Chamekh**
🎓 Développement Web & Applications
💼 Full Stack Junior

📫 *Disponible pour stage / opportunité professionnelle*

---

<div align="center">

✨ *Electro-05 – Build once. Scale everywhere.* ✨

</div>
```

