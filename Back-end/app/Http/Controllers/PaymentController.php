<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class PaymentController extends Controller
{
    public function processPayment(Request $request, $id)
    {
        $request->validate([
            'card_number' => 'required|string',
            'expiry' => 'required|string', // MM/YY
            'cvv' => 'required|string|size:3',
            'card_name' => 'required|string',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Commande introuvable'], 404);
        }

        // Validation stricte (Luhn Algorithm) désactivée pour faciliter les tests virtuels
        $cardNumber = preg_replace('/\D/', '', $request->card_number);
        // if (!$this->luhnCheck($cardNumber)) {
        //     return response()->json(['message' => 'Numéro de carte invalide.'], 422);
        // }
        // On vérifie juste qu'il y a 16 chiffres
        if (strlen($cardNumber) < 16) {
           return response()->json(['message' => 'Veuillez saisir un numéro à 16 chiffres.'], 422);
        }

        // Expiry validation
        $expiryParts = explode('/', $request->expiry);
        if (count($expiryParts) !== 2) {
            return response()->json(['message' => 'Format de date invalide (MM/YY).'], 422);
        }

        $expMonth = (int)$expiryParts[0];
        $expYear = (int)$expiryParts[1];

        $currentYear = (int)date('y');
        $currentMonth = (int)date('m');

        if ($expMonth < 1 || $expMonth > 12) {
            return response()->json(['message' => 'Mois d\'expiration invalide.'], 422);
        }

        // if ($expYear < $currentYear || ($expYear === $currentYear && $expMonth < $currentMonth)) {
        //     return response()->json(['message' => 'La carte a expiré.'], 422);
        // }

        // CVV validation
        if (!preg_match('/^[0-9]{3}$/', $request->cvv)) {
            return response()->json(['message' => 'CVV invalide.'], 422);
        }

        // Update order status
        $order->update([
            'payment_method' => 'card',
            'payment_status' => 'paid',
            'acompte_paid' => true,
            'status' => 'paid', 
        ]);

        // Envoi des infos détaillées pour le reçu virtuel
        $itemsData = $order->items()->with('product')->get()->map(function($item) {
            return [
                'name' => $item->product ? $item->product->name : 'Produit inconnu',
                'quantity' => $item->quantity,
                'price' => $item->price
            ];
        });

        return response()->json([
            'message' => 'Paiement effectué avec succès!',
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'receipt' => [
                'amount' => $order->total_amount ?? $order->total_price ?? 0,
                'date' => now()->toDateTimeString(),
                'card_last4' => substr($cardNumber, -4),
                'card_type' => $cardNumber[0] == '4' ? 'Visa' : ($cardNumber[0] == '5' ? 'Mastercard' : 'Bank Card'),
                'items' => $itemsData
            ]
        ]);
    }

    private function luhnCheck($number)
    {
        $sum = 0;
        $length = strlen($number);
        $parity = $length % 2;

        for ($i = $length - 1; $i >= 0; $i--) {
            $digit = (int)$number[$i];
            if ($i % 2 === $parity) {
                $digit *= 2;
                if ($digit > 9) {
                    $digit -= 9;
                }
            }
            $sum += $digit;
        }

        return $sum % 10 === 0;
    }
}
