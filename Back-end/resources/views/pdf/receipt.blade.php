<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Reçu de Paiement - Commande #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</title>
    <style>
        @page {
            margin: 0;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            background-color: #ffffff;
        }
        .container {
            padding: 40px;
        }
        .accent-bar {
            height: 8px;
            background: linear-gradient(90deg, #2563eb 0%, #3b82f6 100%);
            width: 100%;
        }
        .header {
            margin-bottom: 40px;
        }
        .logo-container {
            float: left;
            width: 50%;
        }
        .logo {
            font-size: 32px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -1.5px;
            text-transform: uppercase;
        }
        .logo .dot {
            color: #2563eb;
            font-size: 40px;
            line-height: 0;
        }
        .logo span {
            color: #64748b;
            font-weight: 300;
        }
        .receipt-info {
            float: right;
            width: 50%;
            text-align: right;
        }
        .receipt-id {
            font-size: 24px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
        }
        .receipt-date {
            color: #64748b;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .divider {
            border-top: 1px solid #e2e8f0;
            margin: 30px 0;
            clear: both;
        }
        
        .billing-section {
            width: 100%;
            margin-bottom: 40px;
        }
        .billing-section td {
            vertical-align: top;
            width: 50%;
        }
        .section-label {
            font-size: 11px;
            font-weight: 800;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            margin-bottom: 10px;
        }
        .billing-info {
            font-size: 14px;
        }
        .billing-name {
            font-size: 16px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 5px;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            text-align: left;
            font-size: 11px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 15px 10px;
            border-bottom: 2px solid #0f172a;
        }
        .items-table td {
            padding: 20px 10px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }
        .product-name {
            font-weight: 700;
            color: #0f172a;
            display: block;
        }
        
        .footer-section {
            margin-top: 30px;
        }
        .payment-method {
            float: left;
            width: 50%;
        }
        .card-box {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 15px;
            display: inline-block;
        }
        .total-box {
            float: right;
            width: 40%;
        }
        .total-row {
            margin-bottom: 10px;
        }
        .total-label {
            color: #64748b;
            font-size: 14px;
        }
        .total-value {
            text-align: right;
            font-weight: 700;
            font-size: 14px;
        }
        .grand-total {
            background: #0f172a;
            color: #ffffff;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .grand-total .label {
            font-size: 12px;
            text-transform: uppercase;
            font-weight: 800;
            letter-spacing: 1px;
        }
        .grand-total .amount {
            font-size: 24px;
            font-weight: 900;
            float: right;
            margin-top: -5px;
        }
        
        .status-badge {
            background-color: #dcfce7;
            color: #15803d;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-top: 10px;
        }
        
        .note {
            clear: both;
            margin-top: 60px;
            padding: 20px;
            background-color: #fdf2f2;
            border-radius: 12px;
            font-size: 12px;
            color: #991b1b;
            text-align: center;
            border: 1px dashed #fecaca;
        }
        
        .legal {
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            margin-top: 30px;
        }
        
        .clear { clear: both; }
    </style>
</head>
<body>
    <div class="accent-bar"></div>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <div class="logo">ELECTRO<span class="dot">.</span><span>05</span></div>
                <div style="font-size: 10px; color: #64748b; margin-top: 5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Solutions Professionnelles</div>
            </div>
            <div class="receipt-info">
                <h1 class="receipt-id">REÇU #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</h1>
                <div class="receipt-date">DÉLIVRÉ LE {{ strtoupper($date) }}</div>
                <div class="status-badge">PAIEMENT APPROUVÉ</div>
            </div>
            <div class="clear"></div>
        </div>

        <div class="divider"></div>

        <table class="billing-section">
            <tr>
                <td>
                    <div class="section-label">Facturé à</div>
                    <div class="billing-info">
                        <div class="billing-name">{{ $order->customer_name ?? ($order->firstName . ' ' . $order->lastName) }}</div>
                        <div>{{ $order->customer_email ?? $order->email }}</div>
                        <div>{{ $order->customer_phone ?? $order->phone }}</div>
                        <div style="color: #64748b; margin-top: 5px;">{{ $order->address }}, {{ $order->city }}</div>
                    </div>
                </td>
                <td style="text-align: right;">
                    <div class="section-label">Expédié par</div>
                    <div class="billing-info">
                        <div class="billing-name">Electro-05</div>
                        <div>Casablanca, Maroc</div>
                        <div>contact@electro05.ma</div>
                        <div style="color: #64748b; margin-top: 5px;">Service Clientèle 24/7</div>
                    </div>
                </td>
            </tr>
        </table>

        <table class="items-table">
            <thead>
                <tr>
                    <th width="50%">Description du Produit</th>
                    <th width="10%" style="text-align: center;">QTÉ</th>
                    <th width="20%" style="text-align: right;">Prix Unitaire</th>
                    <th width="20%" style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        <span class="product-name">{{ $item->product ? $item->product->name : 'Produit Qualité Supérieure' }}</span>
                        <span style="font-size: 11px; color: #64748b;">Ref: #{{ str_pad($item->product_id, 5, '0', STR_PAD_LEFT) }}</span>
                    </td>
                    <td style="text-align: center; font-weight: 700;">{{ $item->quantity }}</td>
                    <td style="text-align: right;">{{ number_format($item->price, 2, ',', ' ') }} DH</td>
                    <td style="text-align: right; font-weight: 800; color: #0f172a;">{{ number_format($item->price * $item->quantity, 2, ',', ' ') }} DH</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer-section">
            <div class="payment-method">
                <div class="section-label">Méthode de Règlement</div>
                <div class="card-box">
                    <table cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="padding-right: 15px;">
                                <div style="width: 45px; height: 30px; background: #1e293b; border-radius: 4px; position: relative;">
                                    <div style="position: absolute; top: 6px; left: 6px; width: 12px; height: 12px; background: rgba(255,255,255,0.2); border-radius: 2px;"></div>
                                </div>
                            </td>
                            <td>
                                <div style="font-weight: 700; font-size: 13px;">{{ strtoupper($cardType) }} VIRTUAL</div>
                                <div style="font-size: 11px; color: #64748b;">**** **** **** {{ $cardLast4 }}</div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <div class="total-box">
                <table width="100%">
                    <tr class="total-row">
                        <td class="total-label">Sous-total</td>
                        <td class="total-value">{{ number_format(($order->total_amount ?? $order->total_price) - 40, 2, ',', ' ') }} DH</td>
                    </tr>
                    <tr class="total-row">
                        <td class="total-label">Livraison Express</td>
                        <td class="total-value">40,00 DH</td>
                    </tr>
                </table>
                
                <div class="grand-total">
                    <span class="label">Total Payé</span>
                    <span class="amount">{{ number_format($order->total_amount ?? $order->total_price, 2, ',', ' ') }} DH</span>
                    <div class="clear"></div>
                </div>
            </div>
            <div class="clear"></div>
        </div>

        <div class="note">
            <strong>INFORMATION IMPORTANTE</strong><br>
            Ceci est un environnement de démonstration. Ce document confirme la réussite d'un paiement simulé 
            via une interface virtuelle 3D. Aucune transaction bancaire réelle n'a été effectuée.
        </div>

        <div class="legal">
            Electro-05 S.A.R.L - Numéro d'enregistrement: RC-CAS-2024-001<br>
            Document généré automatiquement à des fins de test UI/UX.
        </div>
    </div>
</body>
</html>
