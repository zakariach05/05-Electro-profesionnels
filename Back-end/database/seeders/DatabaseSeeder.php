<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing data safely
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \App\Models\Order::truncate();
        \Illuminate\Support\Facades\DB::table('sub_orders')->delete();
        Product::whereNotNull('id')->delete();
        Category::whereNotNull('id')->delete();
        Seller::whereNotNull('id')->delete();
        \Illuminate\Support\Facades\DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        
        $this->call(AdminUserSeeder::class);
        $this->call(LocationSeeder::class);

        // 0. Create Default Seller
        $defaultSeller = Seller::create([
            'name' => 'Electro-05',
            'city' => 'Casablanca',
            'email' => 'zisco7039@gmail.com',
            'prep_days' => 1
        ]);

        // 1. Create Main Categories (Matching Home.jsx UNIVERS_CATEGORIES)
        // 1. Create Main Categories (Matching Home.jsx UNIVERS_CATEGORIES & FilterSidebar)
        $catMap = [
            'Smartphones' => [
                'slug' => 'smartphones', 
                'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
                'subs' => ['iPhone' => 'iphone', 'Samsung Galaxy' => 'samsung_phone', 'Xiaomi' => 'xiaomi', 'Oppo' => 'oppo']
            ],
            'PC & Mac' => [
                'slug' => 'pc-mac', 
                'image' => 'https://images.unsplash.com/photo-1517336714467-d23784a1a821?q=80&w=800',
                'subs' => ['MacBook' => 'macbook', 'Laptops' => 'laptops', 'PC Gamer' => 'pc-gamer', 'Bureautique' => 'office-pc']
            ],
            'Gaming' => [
                'slug' => 'gaming', 
                'image' => 'https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?q=80&w=800',
                'subs' => ['PS5' => 'ps5', 'Xbox' => 'xbox', 'Nintendo' => 'nintendo', 'Accessoires Gaming' => 'gaming-accessories']
            ],
            'TV & Son' => [
                'slug' => 'tv-son', 
                'image' => 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800',
                'subs' => ['Smart TV' => 'smart-tv', 'Home Cinéma' => 'home-cinema', 'Barres de son' => 'soundbars', 'Projecteurs' => 'projectors']
            ],
            'Tablettes' => [
                'slug' => 'tablettes', 
                'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800',
                'subs' => ['iPad' => 'ipad', 'Samsung Tab' => 'samsung-tab', 'Lenovo' => 'lenovo-tab', 'E-readers' => 'ereaders']
            ],
            'Accessoires' => [
                'slug' => 'accessoires', 
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800',
                'subs' => ['Casques' => 'headphones', 'Enceintes' => 'speakers', 'Câbles' => 'cables', 'Chargeurs' => 'chargers', 'Powerbanks' => 'powerbanks']
            ],
            'Domotique' => [
                'slug' => 'domotique', 
                'image' => 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800',
                'subs' => ['Éclairage' => 'lighting', 'Sécurité' => 'security', 'Assistants Vocaux' => 'voice-assistants', 'Caméras' => 'cameras']
            ],
            'Électroménager' => [
                'slug' => 'electromenager', 
                'image' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800',
                'subs' => ['Café' => 'coffee-machines', 'Cuisinière' => 'kitchen', 'Aspirateurs' => 'vacuums', 'Traitement de l\'air' => 'air-treatment']
            ],
            'Réseaux' => [
                'slug' => 'reseaux', 
                'image' => 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800',
                'subs' => ['Routeurs' => 'routers', 'Wifi' => 'wifi-extenders', 'Switch' => 'switches', 'CPL' => 'cpl']
            ]
        ];

        foreach ($catMap as $mainName => $data) {
            $parent = Category::create([
                'name' => $mainName,
                'slug' => $data['slug'],
                'image' => $data['image']
            ]);

            foreach ($data['subs'] as $subName => $subSlug) {
                Category::create([
                    'name' => $subName,
                    'slug' => $subSlug,
                    'parent_id' => $parent->id
                ]);
            }
        }

        // 2. Seed Products with professional Unsplash images
        $this->seedProducts();

        // 3. Seed Orders (Today & History)
        $this->call(OrderSeeder::class);
    }

    private function seedProducts()
    {
        $cats = Category::all()->pluck('id', 'slug')->toArray();

        // --- SMARTPHONES ---
        $this->createProduct($cats['iphone'],        'iPhone 15 Pro Max 256GB Titanium',   'iphone-15-pm',      14500, "product/Apple-AirPods-Pro-2nd-gen-hero-220907.png",                    true,  'neuf', 15);
        $this->createProduct($cats['iphone'],        'iPhone 14 Pro 256GB Deep Purple',    'iphone-14-pro',     10500, "product/AirPods Pro (2ème génération) jpeg.png",                       false, 'neuf', 10);
        $this->createProduct($cats['samsung_phone'], 'Samsung Galaxy S24 Ultra 512GB',     'samsung-s24-ultra', 13500, "product/samsung-galaxy-s24-ultra-12go_256go-noir-titane.png",           true,  'neuf', 5);
        $this->createProduct($cats['samsung_phone'], 'Samsung Galaxy S25 5G 256GB',        'samsung-s25',        7500, "product/Samsung Galaxy S25 5G 12 256 Go Bleu Marine .png",             true,  'neuf', 8);
        $this->createProduct($cats['samsung_phone'], 'Samsung Galaxy A16 5G 8GB 256GB',    'samsung-a16',        3500, "product/Samsung Galaxy A16 5G A166B 8GB 256GB .png",                  false, 'neuf', null);
        $this->createProduct($cats['xiaomi'],        'Redmi Note 12 5G Matte Black',       'redmi-note-12',      2200, "product/Redmi Note 12 5G Matte Black Mobile.png",                     false, 'neuf', null);
        $this->createProduct($cats['xiaomi'],        'Xiaomi Redmi A3 Olive Green',        'xiaomi-redmi-a3',    1500, "product/Xiaomi-Redmi-A3-Olive-Green.png",                             false, 'neuf', null);

        // --- TV ---
        $this->createProduct($cats['smart-tv'],    'Sony Bravia KDL 50"',                  'sony-bravia-50',    18500, "product/SONY KDL-50W656A - 126 cm .png",                              true,  'neuf', 20);
        $this->createProduct($cats['smart-tv'],    'LG ThinQ AI 60" 4K HDR',              'lg-thinq-60',       22500, "product/Smart TV LED 60 LG ThinQ AI 4K HDR .png",                     true,  'neuf', 25);
        $this->createProduct($cats['smart-tv'],    'Samsung Crystal UHD 60" BU8000',       'samsung-bu8000',    12000, "product/samsung-tv-bu8000-smart-tv-crystal-uhd-60-pouces.png",         true,  'neuf', 18);
        $this->createProduct($cats['smart-tv'],    'TV Hisense 55" 4K UHD Smart TV',       'hisense-55',         7500, "product/TV Hisense 55 4K Ultra HD Smart TV Wifi 55A6N Noir.webp",     false, 'neuf', null);
        $this->createProduct($cats['smart-tv'],    'TCL 60" 4K UHD Android Smart LED TV', 'tcl-60',             8500, "product/TCL 60 Inch 4K UHD Android Smart LED TV Golden Metallic.jpg", false, 'neuf', null);
        $this->createProduct($cats['smart-tv'],    'Xiaomi Mi TV 3 60" Full HD',           'xiaomi-tv60',        6900, "product/Xiaomi Mi TV 3 60  full.png",                                false, 'neuf', 12);

        // --- PC & MAC ---
        $this->createProduct($cats['macbook'],    'MacBook Air 13" Retina 2020 M1',        'macbook-air-m1',     9900, "product/Apple-MacBook-Air-Retina-13-inch-2020-tera.png",              true,  'neuf', 5);
        $this->createProduct($cats['macbook'],    'MacBook Air 13" Retina 2021',           'macbook-air-2021',  11500, "product/Apple-MacBook-Air-Retina-13-inch-2021-tera.png",              false, 'neuf', null);
        $this->createProduct($cats['macbook'],    'Apple MacBook Air M1 A2337',            'macbook-a2337',      8500, "product/MacBook-Air-A2337-M1-7-1.png",                               false, 'occasion', null);
        $this->createProduct($cats['macbook'],    'Apple iMac 21.5" Retina 4K',           'imac-21-4k',        14000, "product/Apple-iMac-21.5-pouces-avec-ecran-Retina-4K.png",             true,  'neuf', 10);
        $this->createProduct($cats['laptops'],    'HP EliteBook x360',                     'hp-elitebook-x360',  9500, "product/Pc Portable HP EliteBook x360.jpg.png",                     false, 'neuf', null);
        $this->createProduct($cats['laptops'],    'Ordinateur Portable HP 14" i5 13th',   'hp-14-i5-13th',      7500, "product/Ordinateur portable HP 14- I5 13th (845A4EA).png",           true,  'neuf', 8);
        $this->createProduct($cats['laptops'],    'Portable HP 250 G9 Intel',              'hp-250-g9',          5500, "product/Portable-Hp 250-G9 Intel .png",                              false, 'neuf', null);
        $this->createProduct($cats['laptops'],    'HP ZBook Intel Core i9 32GB 512GB',     'hp-zbook-i9',       18500, "product/hp-zbook-intel-core-i9-10885h-32gb-512gb.png",               false, 'neuf', null);
        $this->createProduct($cats['laptops'],    'Pc Portable Acer Aspire i5',            'acer-i5',            5800, "product/Pc portable Acer i5 I5-8256U .png",                          false, 'neuf', null);
        $this->createProduct($cats['laptops'],    'PC Portable ASUS X515E i5',             'asus-x515e',         6200, "product/pc-portable-asus-x515e-i5-1135g7.png",                       false, 'neuf', null);
        $this->createProduct($cats['laptops'],    'Lenovo ThinkPad P16 Gen 6',             'lenovo-thinkpad-p16',22000, "product/Lenovo-Thinkpad-P16-Gen-6-Vue-de-face.png",                  true,  'neuf', 12);
        $this->createProduct($cats['laptops'],    'PC Portable Dell 14"',                  'dell-14',            7500, "product/pc-portable-dell-14.png",                                    false, 'neuf', null);
        $this->createProduct($cats['pc-gamer'],  'PC Gamer Nexus Ryzen 7 RTX 4060',       'pc-gamer-nexus',    15500, "product/pc-gamer-nexus-ryzen7-rtx4060.png",                           true,  'neuf', null);
        $this->createProduct($cats['pc-gamer'],  'PC Gamer Ultime Ryzen 5 5600X',         'pc-gamer-r5',       12500, "product/pc-gamer-ultime-ryzen-5-5600x-front.png",                     false, 'neuf', 5);
        $this->createProduct($cats['pc-gamer'],  'PC Gamer I9-12900K RTX 4060Ti',         'pc-gamer-i9',       18500, "product/PC-GAMER-I9-12900K-RTX-4060TI-NOX-HUMMER-ASTRA-RGB-MAROC.png",true, 'neuf', 15);
        $this->createProduct($cats['pc-gamer'],  'Setup Gamer Airflow R3 3200G',          'setup-gamer',        9500, "product/SETUP-GAMER-AIRFLOW-R3-3200G-VEGA-8-8Go-FIGHTER-HP24IFL-HPG200.png",false,'neuf',null);
        $this->createProduct($cats['office-pc'], 'DELL Optiplex 3000 MT 27" IPS',         'dell-optiplex-3000', 8500, "product/DELL-Optiplex-3000-MT-27-POUCES-IPS.png",                    true,  'neuf', 10);
        $this->createProduct($cats['office-pc'], 'HP Pro 400 G9 i7-13700',               'hp-pro-g9',          7500, "product/hp-pro-400-g9-intelR-core-i7-13700-8-go-ddr4.png",            false, 'neuf', null);
        $this->createProduct($cats['office-pc'], 'PC Bureau HP 600 G2 Microtower i5',    'hp-600-g2',          4500, "product/pc-bureau-hp-600-g2-microtower-i5.png",                        false, 'occasion', null);
        $this->createProduct($cats['office-pc'], 'Lenovo ThinkCentre NEO50T i5-12th',   'lenovo-thinkcentre',  5500, "product/PC Bureau LENOVO ThinkCentre NEO50T - I5-12th.png",            false, 'neuf', null);
        $this->createProduct($cats['office-pc'], 'Acer Bureau PC',                       'acer-bureau',         4200, "product/acer-Bureau.png",                                             false, 'occasion', null);

        // --- GAMING ---
        $this->createProduct($cats['ps5'],    'Console PlayStation 5 Pro',               'ps5-pro',             8500, "product/PS5-Pro-1.png",                                               true,  'neuf', 5);
        $this->createProduct($cats['xbox'],   'Sony PlayStation 5 Disc Version',         'ps5-disc',            7500, "product/Sony-PlayStation-5-PS5-Gaming-Console-Disc-Version.avif",     false, 'neuf', null);
        $this->createProduct($cats['pc-gamer'], 'MSI GL63 Gaming i7 GTX 1050 8GB',      'msi-gl63',           10500, "product/MSI-GL63-Gaming-Laptop-15-6-Intel-Core-i7-8750H-NVIDIA-GeForce-GTX-1050-8gb-RAM-256gb-SSD-1TB.avif",false,'neuf',null);
        $this->createProduct($cats['gaming-accessories'], 'ASUS ROG STRIX i7 Ecran 24"','asus-rog-strix',      9500, "product/ASUS-ROGUE-STRIX-I7-AVEC-ECRAN-24.png",                       true,  'neuf', 10);

        // --- AUDIO ---
        $this->createProduct($cats['headphones'], 'Apple AirPods Max USB-C',             'airpods-max',         6500, "product/APPLE AIRPODS MAX USB-C .png",                                true,  'neuf', 10);
        $this->createProduct($cats['headphones'], 'Apple AirPods Pro 2e Generation',     'airpods-pro-2',       3500, "product/Apple-AirPods-Pro-2nd-gen-hero-220907.png",                   false, 'neuf', null);
        $this->createProduct($cats['headphones'], 'Casque AirPods Max sans fil',         'airpods-max-wl',      5800, "product/casque-airpods-max-apple-sans-fil-high-quality.png",           false, 'neuf', null);

        // --- TABLETTES ---
        $this->createProduct($cats['ipad'],       'iPad Air / iPad Mini / iPad Pro',     'ipad-collection',     6500, "product/iPad - iPad Air - iPad Mini - iPad Pro .png",                  true,  'neuf', 8);
        $this->createProduct($cats['samsung-tab'],'Samsung Galaxy Tab A 2016 10.1"',    'samsung-tab-a',        2800, "product/Tablette-SAMSUNG-Galaxy-Tab-A-2016-10.1.png",                 false, 'occasion', null);
        $this->createProduct($cats['lenovo-tab'], 'Lenovo Tab M10 FHD+ 64GB',           'lenovo-tab-m10',       2500, "product/Lenovo-Tab-M10-FHD-Plus-10-3-Tablet-64GB-Storage.avif",       false, 'neuf', null);
        $this->createProduct($cats['lenovo-tab'], 'Xiaomi Redmi Pad Pro',               'xiaomi-pad-pro',       3200, "product/xiaomi-redmi-pad-pro-1.png",                                  false, 'neuf', null);

        // --- PC APPLE ---
        $this->createProduct($cats['macbook'], 'Apple MacBook Pro i5 QC 13" 16GB',      'macbook-pro-i5',      11500, "product/apple-macbook-pro-puce-intel-core-i5-quadricoeur-133-ram-16-go-.png",false,'occasion',null);
    }

    private function createProduct($catId, $name, $slug, $price, $img, $featured = false, $state = 'neuf', $promo = null, $desc = null)
    {
        Product::create([
            'category_id' => $catId,
            'seller_id' => Seller::first()->id,
            'name' => $name,
            'slug' => $slug,
            'description' => $desc ?? "Produit premium sélectionné par Electro-05 pour sa qualité et ses performances exceptionnelles.",
            'price' => $price,
            'old_price' => $promo ? round($price / (1 - $promo/100)) : null,
            'image' => $img,
            'stock' => rand(10, 100),
            'is_featured' => $featured,
            'state' => $state,
            'promo' => $promo
        ]);
    }
}
