<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$products = App\Models\Product::where('image', 'like', '%AirPods%')
    ->orWhere('name', 'like', '%AirPods%')
    ->get(['id', 'name', 'image', 'category_id', 'description'])
    ->toArray();
print_r($products);
