<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MagicLinkController;
use App\Http\Controllers\OtpController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\WishlistController;

// ─── Public Auth Routes ────────────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:3,1');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');

// Magic link
Route::post('/auth/magic-link',   [MagicLinkController::class, 'send']);
Route::post('/auth/magic-verify', [MagicLinkController::class, 'verify']);

// Google OAuth (token-based)
Route::post('/auth/google', [GoogleAuthController::class, 'handleGoogle']);

// OTP — Email Verification
Route::post('/otp/send-verification', [OtpController::class, 'sendVerification']);
Route::post('/otp/verify-email',      [OtpController::class, 'verifyEmail']);

// OTP — Forgot Password
Route::post('/otp/send-reset',    [OtpController::class, 'sendPasswordReset']);
Route::post('/otp/reset-password',[OtpController::class, 'resetPassword']);

// ─── Public Data Routes ────────────────────────────────────────────────────────
Route::get('/locations', [LocationController::class, 'index']);

Route::get('/brands', function () {
    return response()->json([
        ['name' => 'Apple',   'logo' => 'apple.png'],
        ['name' => 'Samsung', 'logo' => 'samsung.png'],
        ['name' => 'Sony',    'logo' => 'sony.png'],
        ['name' => 'LG',      'logo' => 'lg.png'],
        ['name' => 'MSI',     'logo' => 'msi.png'],
        ['name' => 'HP',      'logo' => 'hp.png'],
        ['name' => 'Dell',    'logo' => 'dell.png'],
        ['name' => 'Asus',    'logo' => 'asus.png'],
    ]);
});

Route::get('/products',            [ProductController::class, 'index']);
Route::get('/products/{id}',       [ProductController::class, 'show']);
Route::get('/categories',          [CategoryController::class, 'index']);
Route::get('/categories/{id}',     [CategoryController::class, 'show']);

// Public reviews
Route::get('/products/{id}/reviews', [ReviewController::class, 'index']);

Route::post('/contact', [ContactController::class, 'send'])->middleware('throttle:3,1');


Route::post('/orders',         [OrderController::class, 'store']);
Route::get('/orders/{id}',     [OrderController::class, 'show']);
Route::post('/orders/{id}/pay',[App\Http\Controllers\PaymentController::class, 'processPayment'])->middleware('auth:sanctum');
Route::get('/orders/{id}/receipt', [App\Http\Controllers\ReceiptController::class, 'downloadPDF']);
Route::get('/invoice/{id}',    [OrderController::class, 'viewInvoice']);

// ─── Authenticated User Routes (profile only — no verification needed) ─────────
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user',                [AuthController::class, 'me']);
    Route::put('/user',                [AuthController::class, 'update']);
    Route::post('/user/change-password',[AuthController::class, 'changePassword']);
    Route::post('/logout',             [AuthController::class, 'logout']);
});

// ─── Verified User Routes (email must be verified) ─────────────────────────────
Route::middleware(['auth:sanctum', 'verified.email'])->group(function () {
    Route::get('/my-orders', [OrderController::class, 'myOrders']);

    // Authenticated reviews
    Route::post('/products/{id}/reviews',  [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}',         [ReviewController::class, 'destroy']);

    // Wishlist
    Route::get('/wishlist',              [WishlistController::class, 'index']);
    Route::get('/wishlist/ids',          [WishlistController::class, 'ids']);
    Route::post('/wishlist/toggle',      [WishlistController::class, 'toggle']);
    Route::delete('/wishlist/{productId}',[WishlistController::class, 'remove']);
    Route::delete('/wishlist',           [WishlistController::class, 'clear']);
});

// ─── Admin Only Routes ─────────────────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Products
    Route::post('/products',                 [ProductController::class, 'store']);
    Route::put('/products/{id}',             [ProductController::class, 'update']);
    Route::delete('/products/{id}',          [ProductController::class, 'destroy']);
    Route::get('/admin/products/export',     [ProductController::class, 'exportStock']);

    // Categories
    Route::post('/categories',               [CategoryController::class, 'store']);
    Route::put('/categories/{id}',           [CategoryController::class, 'update']);
    Route::delete('/categories/{id}',        [CategoryController::class, 'destroy']);

    // Orders
    Route::get('/admin/orders',              [OrderController::class, 'index']);
    Route::get('/admin/orders/export',       [OrderController::class, 'exportOrders']);
    Route::patch('/admin/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::patch('/admin/orders/{id}/assign', [OrderController::class, 'assignAgent']);
    Route::patch('/admin/orders/{id}/payment',[OrderController::class, 'updatePayment']);
    Route::post('/admin/orders/{id}/refund',  [OrderController::class, 'refund']);
    Route::get('/admin/orders/{id}/invoice',  [OrderController::class, 'generateInvoice']);
    Route::post('/admin/orders/{id}/resend-invoice', [App\Http\Controllers\InvoiceController::class, 'resend']);

    // Reviews moderation
    Route::get('/admin/reviews',               [ReviewController::class, 'adminIndex']);
    Route::patch('/admin/reviews/{id}/approve',[ReviewController::class, 'approve']);

    // Stats & Users
    Route::get('/admin/stats',               [DashboardController::class, 'stats']);
    Route::get('/admin/users',               [AuthController::class, 'index']);
});
