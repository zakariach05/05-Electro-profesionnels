<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;

// Update Product 1 (Black AirPods Pro)
$p1 = Product::find(1);
if ($p1) {
    $p1->update([
        'name' => 'Apple AirPods Pro 2 (Noir)',
        'slug' => 'apple-airpods-pro-2-noir',
        'price' => 2900,
        'old_price' => 3411,
        'category_id' => 27,
        'description' => 'Rebuilt from the sound up. La réduction active du bruit intelligente et un son tridimensionnel supérieur.'
    ]);
    echo "Product 1 updated.\n";
} else {
    echo "Product 1 not found.\n";
}

// Update Product 2 (White AirPods Pro)
$p2 = Product::find(2);
if ($p2) {
    $p2->update([
        'name' => 'Apple AirPods Pro 2 (Blanc)',
        'slug' => 'apple-airpods-pro-2-blanc',
        'price' => 2500,
        'old_price' => 2777,
        'category_id' => 27,
        'description' => 'La magie réentendue. Un son immersif haute fidélité avec une réduction active du bruit performante.'
    ]);
    echo "Product 2 updated.\n";
} else {
    echo "Product 2 not found.\n";
}
