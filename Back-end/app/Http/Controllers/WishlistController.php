<?php

namespace App\Http\Controllers;

use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * GET /api/wishlist  — Get authenticated user's wishlist.
     */
    public function index(Request $request)
    {
        $items = Wishlist::where('user_id', $request->user()->id)
            ->with(['product' => fn($q) => $q->with('category')->select('id', 'name', 'price', 'stock', 'image', 'category_id')])
            ->get()
            ->map(fn($w) => $w->product)
            ->filter(); // Remove null products (deleted)

        return response()->json($items->values());
    }

    /**
     * POST /api/wishlist/toggle  — Toggle product in wishlist.
     */
    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|integer|exists:products,id']);

        $userId    = $request->user()->id;
        $productId = $request->product_id;

        $existing = Wishlist::where('user_id', $userId)->where('product_id', $productId)->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['added' => false, 'message' => 'Retiré de la liste de souhaits']);
        }

        Wishlist::create(['user_id' => $userId, 'product_id' => $productId]);
        return response()->json(['added' => true, 'message' => 'Ajouté à la liste de souhaits']);
    }

    /**
     * DELETE /api/wishlist/{productId}  — Remove specific item.
     */
    public function remove(Request $request, int $productId)
    {
        Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->delete();

        return response()->json(['message' => 'Retiré de la liste de souhaits']);
    }

    /**
     * GET /api/wishlist/ids  — Get just product IDs for quick lookups.
     */
    public function ids(Request $request)
    {
        $ids = Wishlist::where('user_id', $request->user()->id)->pluck('product_id');
        return response()->json($ids);
    }

    /**
     * DELETE /api/wishlist  — Clear entire wishlist.
     */
    public function clear(Request $request)
    {
        Wishlist::where('user_id', $request->user()->id)->delete();
        return response()->json(['message' => 'Liste de souhaits vidée']);
    }
}
