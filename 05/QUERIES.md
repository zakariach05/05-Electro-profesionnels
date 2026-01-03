# 📊 Guide des Requêtes de Base de Données (Electro-05)

Ce fichier contient des exemples de requêtes utiles pour gérer la base de données de votre boutique, que ce soit via **SQL** (ex: dans un gestionnaire de BDD) ou via **Eloquent** (dans le code Laravel).

---

## 📦 Produits (Products)

### 1. Lister tous les produits avec leurs prix et stock
**SQL :**
```sql
SELECT name, price, stock FROM products;
```
**Eloquent :**
```php
$products = Product::select('name', 'price', 'stock')->get();
```

### 2. Trouver les produits en promotion
**SQL :**
```sql
SELECT name, price, promo FROM products WHERE promo > 0;
```
**Eloquent :**
```php
$promos = Product::where('promo', '>', 0)->get();
```

### 3. Calculer la valeur totale du stock
**SQL :**
```sql
SELECT SUM(price * stock) as total_value FROM products;
```
**Eloquent :**
```php
$totalValue = Product::sum(\DB::raw('price * stock'));
```

---

## 📂 Catégories (Categories)

### 1. Lister les catégories principales (sans parent)
**SQL :**
```sql
SELECT name, slug FROM categories WHERE parent_id IS NULL;
```
**Eloquent :**
```php
$mainCategories = Category::whereNull('parent_id')->get();
```

### 2. Compter le nombre de produits par catégorie
**SQL :**
```sql
SELECT c.name, COUNT(p.id) as product_count 
FROM categories c 
LEFT JOIN products p ON c.id = p.category_id 
GROUP BY c.id;
```
**Eloquent :**
```php
$counts = Category::withCount('products')->get();
```

---

## 🛒 Commandes (Orders)

### 1. Voir les 10 dernières commandes
**SQL :**
```sql
SELECT id, customer_name, total_amount, status 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;
```
**Eloquent :**
```php
$latestOrders = Order::latest()->take(10)->get();
```

### 2. Calculer le chiffre d'affaires total
**SQL :**
```sql
SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered';
```
**Eloquent :**
```php
$revenue = Order::where('status', 'delivered')->sum('total_amount');
```

---

## 👤 Utilisateurs (Users)

### 1. Trouver tous les administrateurs
**SQL :**
```sql
SELECT name, email FROM users WHERE role = 'admin';
```
**Eloquent :**
```php
$admins = User::where('role', 'admin')->get();
```

---

## 🚀 Comment tester ces requêtes ?

1. **Eloquent (PHP)** : Utilisez la commande suivante dans votre terminal pour entrer dans la console interactive de Laravel :
   ```bash
   php artisan tinker
   ```
   Puis tapez vos commandes (ex: `App\Models\Product::count();`).

2. **SQL** : Utilisez un outil comme **DB Browser for SQLite** (si vous utilisez SQLite) ou **phpMyAdmin/TablePlus** (si vous utilisez MySQL).
