<?php
// Quick SMTP test — run with: php test_mail.php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    \Illuminate\Support\Facades\Mail::raw('✅ SMTP works! OTP emails will be delivered.', function ($m) {
        $m->to('chamekhwassim9@gmail.com')->subject('Electro-05 SMTP Test');
    });
    echo "✅ Email sent successfully!\n";
} catch (\Exception $e) {
    echo "❌ SMTP Error: " . $e->getMessage() . "\n";
}
