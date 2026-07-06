<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Seeder;

class IphoneProductsSeeder extends Seeder
{
    public function run()
    {
        $iphoneCat = Category::where('slug', 'iphone')->first();
        if (!$iphoneCat) {
            $smartphones = Category::where('slug', 'smartphones')->first();
            $iphoneCat = Category::create([
                'name' => 'iPhone',
                'slug' => 'iphone',
                'parent_id' => $smartphones ? $smartphones->id : null,
            ]);
        }

        $products = [
            [
                'name' => 'iPhone 16 128GB',
                'slug' => 'iphone-16-128gb',
                'description' => 'Découvrez l\'iPhone 16 avec son nouveau design, puce A18 et appareil photo avancé. Performance exceptionnelle et autonomie améliorée.',
                'price' => 12000.00,
                'old_price' => 14000.00,
                'image' => 'product/iphone_16__.jpg',
                'stock' => 15,
                'state' => 'neuf',
                'promo' => 15,
                'is_featured' => 1,
                'seller_id' => 1,
            ],
            [
                'name' => 'iPhone 17e',
                'slug' => 'iphone-17e',
                'description' => 'iPhone 17e — innovation et puissance réunies. Puce A19, écran OLED ProMotion 120Hz, design钛. Idéal pour les professionnels.',
                'price' => 15000.00,
                'old_price' => 18000.00,
                'image' => 'product/iphone_17e__.jpg',
                'stock' => 10,
                'state' => 'neuf',
                'promo' => 17,
                'is_featured' => 1,
                'seller_id' => 1,
            ],
            [
                'name' => 'iPhone 17 256GB',
                'slug' => 'iphone-17-256gb',
                'description' => 'iPhone 17 — le nouveau flagship. Puce A19 Pro, appareil photo 48MP, batterie longue durée. Disponible en plusieurs coloris.',
                'price' => 17000.00,
                'old_price' => 20000.00,
                'image' => 'product/iphone_17__.jpg',
                'stock' => 12,
                'state' => 'neuf',
                'promo' => 15,
                'is_featured' => 1,
                'seller_id' => 1,
            ],
            [
                'name' => 'iPhone 17 Air',
                'slug' => 'iphone-17-air',
                'description' => 'iPhone 17 Air — le plus fin et léger de la gamme. Design ultra-mince, écran 6.7", puce A19, idéal pour un usage quotidien.',
                'price' => 16000.00,
                'old_price' => 19000.00,
                'image' => 'product/iphone_air.jpg',
                'stock' => 8,
                'state' => 'neuf',
                'promo' => 16,
                'is_featured' => 1,
                'seller_id' => 1,
            ],
            [
                'name' => 'iPhone 17 Pro Max 1TB',
                'slug' => 'iphone-17-pro-max-1tb',
                'description' => 'iPhone 17 Pro Max — le meilleur d\'Apple. Puce A19 Pro, triple appareil photo 48MP, zoom optique 5x, titane, 1TB de stockage.',
                'price' => 25000.00,
                'old_price' => 29000.00,
                'image' => 'product/iphone_17pro.jpg',
                'stock' => 5,
                'state' => 'neuf',
                'promo' => 14,
                'is_featured' => 1,
                'seller_id' => 1,
            ],
        ];

        foreach ($products as $data) {
            $data['category_id'] = $iphoneCat->id;
            Product::updateOrCreate(['slug' => $data['slug']], $data);
        }

        $this->command->info(count($products) . ' produits iPhone ajoutés avec succès !');
    }
}
