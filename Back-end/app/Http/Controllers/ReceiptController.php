<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptController extends Controller
{
    public function downloadPDF(Request $request, $id)
    {
        $order = Order::with('items.product')->findOrFail($id);
        
        $cardLast4 = $request->query('last4', '0000');
        $cardType = $request->query('type', 'Carte V');

        $data = [
            'order' => $order,
            'cardLast4' => $cardLast4,
            'cardType' => $cardType,
            'date' => now()->format('d/m/Y H:i'),
        ];

        $pdf = Pdf::loadView('pdf.receipt', $data);
        
        return $pdf->download("Recu_Commande_#{$order->id}.pdf");
    }
}
