USE electro_05;

SELECT * FROM users;


SELECT * FROM electro_05.products;
SELECT name, price, stock FROM products;
SELECT name, price, promo FROM products WHERE promo > 0;
SELECT SUM(price * stock) as total_value FROM products;
SELECT name, slug FROM categories WHERE parent_id IS NULL;
SELECT c.name, COUNT(p.id) as product_count 
FROM categories c 
LEFT JOIN products p ON c.id = p.category_id 
GROUP BY c.id;

SELECT id, customer_name, total_amount, status 
FROM orders 
ORDER BY created_at DESC 
LIMIT 10;

SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered';

SELECT name, email FROM users WHERE role = 'admin';