<?php

namespace App\Http\Controllers;

use App\Mail\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Handle the incoming contact form submission.
     */
    public function send(Request $request)
    {
        // 1. Validation logic
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|min:3|max:255',
            'message' => 'required|string|min:10|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Veuillez corriger les erreurs dans le formulaire.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'email', 'subject', 'message']);

        try {
            // 2. Send email to the admin
            $adminEmail = config('mail.from.address') ?? 'zisco7039@gmail.com';
            
            // Try sending the mail
            Mail::to($adminEmail)->send(new ContactMessage($data));

            // Log for safe keeping
            Log::info("Nouveau message de contact via EMAIL de " . $data['email']);

            return response()->json([
                'success' => true,
                'message' => 'Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.'
            ]);
        } catch (\Exception $e) {
            // If mail fails, at least log it so we don't lose the data and return a success to user
            Log::error("Échec envoi EMAIL contact, sauvegarde en LOG : " . $e->getMessage());
            Log::channel('single')->info("CONTACT FORM SUBMISSION (BACKUP): " . json_encode($data));

            return response()->json([
                'success' => true,
                'message' => 'Votre message a été reçu par nos services. Un conseiller vous recontactera prochainement.'
            ]);
        }
    }
}
