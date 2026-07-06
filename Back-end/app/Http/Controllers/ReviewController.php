<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Product;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * GET /api/products/{id}/reviews
     * Public: list approved reviews for a product.
     */
    public function index(int $productId)
    {
        $reviews = Review::with('user:id,name,avatar')
            ->where('product_id', $productId)
            ->where('approved', true)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($r) => [
                'id'               => $r->id,
                'rating'           => $r->rating,
                'title'            => $r->title,
                'body'             => $r->body,
                'verified_purchase'=> $r->verified_purchase,
                'created_at'       => $r->created_at->diffForHumans(),
                'user'             => [
                    'name'   => $r->user->name,
                    'avatar' => $r->user->avatar,
                ],
            ]);

        $stats = [
            'average' => round(Review::where('product_id', $productId)->where('approved', true)->avg('rating'), 1),
            'count'   => $reviews->count(),
            'by_star' => Review::where('product_id', $productId)
                ->where('approved', true)
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray(),
        ];

        return response()->json(['reviews' => $reviews, 'stats' => $stats]);
    }

    /**
     * POST /api/products/{id}/reviews
     * Auth required: submit a review.
     */
    public function store(Request $request, int $productId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title'  => 'nullable|string|max:120',
            'body'   => 'nullable|string|max:1000',
        ]);

        $userId = $request->user()->id;

        // Check if already reviewed
        if (Review::where('product_id', $productId)->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'Vous avez déjà évalué ce produit'], 422);
        }

        // Check verified purchase (user bought this product)
        $verified = OrderItem::whereHas('order', fn($q) => $q->where('customer_email', $request->user()->email)->where('status', '!=', 'cancelled'))
            ->where('product_id', $productId)
            ->exists();

        $review = Review::create([
            'product_id'        => $productId,
            'user_id'           => $userId,
            'rating'            => $request->rating,
            'title'             => $request->title,
            'body'              => $request->body,
            'verified_purchase' => $verified,
        ]);

        return response()->json(['message' => 'Avis ajouté', 'review' => $review->load('user:id,name,avatar')], 201);
    }

    /**
     * DELETE /api/reviews/{id}
     * Auth: user can delete own review, admin can delete any.
     */
    public function destroy(Request $request, int $id)
    {
        $review = Review::findOrFail($id);
        $user   = $request->user();

        if ($review->user_id !== $user->id && $user->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $review->delete();
        return response()->json(['message' => 'Avis supprimé']);
    }

    /**
     * GET /api/admin/reviews  — Admin: list all reviews
     */
    public function adminIndex()
    {
        $reviews = Review::with(['user:id,name', 'product:id,name'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return response()->json($reviews);
    }

    /**
     * PATCH /api/admin/reviews/{id}/approve
     */
    public function approve(int $id)
    {
        $review = Review::findOrFail($id);
        $review->update(['approved' => !$review->approved]);
        return response()->json(['message' => 'Statut mis à jour', 'approved' => $review->approved]);
    }
}
