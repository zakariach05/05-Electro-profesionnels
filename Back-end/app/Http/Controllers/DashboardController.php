<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        // ── Core KPIs ───────────────────────────────────────────────────────
        $totalOrders   = Order::count();
        $totalRevenue  = Order::where('payment_status', 'paid')->sum('total_amount');
        $totalProducts = Product::count();
        $totalUsers    = User::where('role', 'user')->count();
        $totalReviews  = Review::count();

        $dailyOrders   = Order::whereDate('created_at', now()->today())->count();
        $lateOrders    = Order::where('status', 'pending')->where('created_at', '<', now()->subHours(48))->count();
        $lowStockItems = Product::where('stock', '>', 0)->where('stock', '<=', 5)->count();
        $outOfStock    = Product::where('stock', 0)->count();

        // ── Revenue trend — last 30 days ────────────────────────────────────
        $revenueTrend = Order::where('payment_status', 'paid')
            ->where('created_at', '>=', now()->subDays(29))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($r) => [
                'date'    => $r->date,
                'revenue' => (float) $r->revenue,
                'orders'  => (int) $r->orders,
            ]);

        // Fill in missing days with 0
        $trend = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $found = $revenueTrend->firstWhere('date', $date);
            $trend[] = ['date' => $date, 'revenue' => $found ? $found['revenue'] : 0, 'orders' => $found ? $found['orders'] : 0];
        }

        // ── Payment breakdown ────────────────────────────────────────────────
        $paymentStats = [
            'paid'     => (float) Order::where('payment_status', 'paid')->sum('total_amount'),
            'unpaid'   => (float) Order::where('payment_status', 'unpaid')->sum('total_amount'),
            'refunded' => (float) Order::where('payment_status', 'refunded')->sum('total_amount'),
        ];

        // ── Order status breakdown ───────────────────────────────────────────
        $orderStatuses = Order::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // ── Top selling products ────────────────────────────────────────────
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.payment_status', 'paid')
            ->select(
                'products.id',
                'products.name',
                'products.image',
                'products.price',
                'products.stock',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.image', 'products.price', 'products.stock')
            ->orderByDesc('total_sold')
            ->limit(10)
            ->get();

        // ── New users trend — last 30 days ──────────────────────────────────
        $usersTrend = User::where('created_at', '>=', now()->subDays(29))
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // ── Geographic distribution ──────────────────────────────────────────
        $cityStats = Order::select('customer_city', DB::raw('count(*) as count'))
            ->whereNotNull('customer_city')
            ->groupBy('customer_city')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // ── Recent activity log ──────────────────────────────────────────────
        $recentActivity = \App\Models\ActivityLog::with('user')->latest()->take(10)->get();

        // ── Stock alerts ─────────────────────────────────────────────────────
        $stockAlerts = Product::where('stock', '<=', 5)
            ->orderBy('stock')
            ->select('id', 'name', 'stock', 'image')
            ->limit(10)
            ->get();

        // ── Monthly comparison ───────────────────────────────────────────────
        $thisMonth  = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('total_amount');

        $lastMonth = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('total_amount');

        $growth = $lastMonth > 0 ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 1) : 0;

        return response()->json([
            'overview' => [
                'total_orders'   => $totalOrders,
                'total_revenue'  => $totalRevenue,
                'total_products' => $totalProducts,
                'total_users'    => $totalUsers,
                'total_reviews'  => $totalReviews,
                'daily_orders'   => $dailyOrders,
                'late_orders'    => $lateOrders,
                'low_stock'      => $lowStockItems,
                'out_of_stock'   => $outOfStock,
                'this_month'     => $thisMonth,
                'last_month'     => $lastMonth,
                'growth'         => $growth,
            ],
            'revenue_trend'   => $trend,
            'payment'         => $paymentStats,
            'order_statuses'  => $orderStatuses,
            'top_products'    => $topProducts,
            'users_trend'     => $usersTrend,
            'cities'          => $cityStats,
            'stock_alerts'    => $stockAlerts,
            'activity'        => $recentActivity,
        ]);
    }
}
