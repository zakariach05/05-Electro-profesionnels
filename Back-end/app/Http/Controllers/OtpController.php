<?php

namespace App\Http\Controllers;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class OtpController extends Controller
{
    /**
     * Send OTP for email verification after registration.
     */
    public function sendVerification(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $key = 'otp:' . $request->email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Trop de tentatives. Réessayez dans {$seconds} secondes."
            ], 429);
        }
        RateLimiter::hit($key, 60);

        $otp = Otp::generate($request->email, 'email_verification');
        $this->sendOtpEmail($request->email, $otp->code, 'Vérification de votre adresse email');

        return response()->json(['message' => 'Code OTP envoyé', 'expires_in' => 600]);
    }

    /**
     * Verify OTP for email verification.
     */
    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
        ]);

        $otp = Otp::where('email', $request->email)
            ->where('code', $request->code)
            ->where('type', 'email_verification')
            ->where('used', false)
            ->first();

        if (!$otp || !$otp->isValid()) {
            return response()->json(['message' => 'Code invalide ou expiré'], 422);
        }

        $otp->update(['used' => true]);
        User::where('email', $request->email)->update(['email_verified' => true]);

        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Email vérifié avec succès',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Send OTP for password reset.
     */
    public function sendPasswordReset(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $key = 'otp_reset:' . $request->email;
        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Trop de tentatives. Réessayez dans {$seconds} secondes."
            ], 429);
        }
        RateLimiter::hit($key, 60);

        $otp = Otp::generate($request->email, 'password_reset');
        $this->sendOtpEmail($request->email, $otp->code, 'Réinitialisation de votre mot de passe');

        return response()->json(['message' => 'Code OTP envoyé', 'expires_in' => 600]);
    }

    /**
     * Verify OTP for password reset & set new password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $otp = Otp::where('email', $request->email)
            ->where('code', $request->code)
            ->where('type', 'password_reset')
            ->where('used', false)
            ->first();

        if (!$otp || !$otp->isValid()) {
            return response()->json(['message' => 'Code invalide ou expiré'], 422);
        }

        $otp->update(['used' => true]);
        User::where('email', $request->email)->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }

    /**
     * Internal helper: send styled OTP email.
     */
    private function sendOtpEmail(string $email, string $code, string $subject): void
    {
        $html = view('emails.otp', ['code' => $code, 'subject' => $subject])->render();

        Mail::html($html, function ($message) use ($email, $subject) {
            $message->to($email)->subject($subject);
        });
    }
}
