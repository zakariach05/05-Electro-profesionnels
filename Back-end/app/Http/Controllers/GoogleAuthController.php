<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Handle Google Sign-In.
     * Accepts either:
     *   - { credential: "JWT..." }  → Google One-Tap / GIS (decode JWT to get user info)
     *   - { access_token: "..." }   → Standard OAuth2 access token (call userinfo API)
     */
    public function handleGoogle(Request $request)
    {
        $request->validate([
            'credential'   => 'required_without:access_token|string|nullable',
            'access_token' => 'required_without:credential|string|nullable',
        ]);

        $googleId = null;
        $email    = null;
        $name     = 'Utilisateur';
        $avatar   = null;

        // ── Case 1 : Google One-Tap JWT credential ──────────────────────
        if ($request->filled('credential')) {
            $credential = $request->credential;

            // Verify JWT with Google's tokeninfo endpoint (simplest server-side check)
            $isLocal    = app()->environment('local');
            $httpClient = $isLocal ? Http::withoutVerifying() : Http::withOptions([]);

            $response = $httpClient->get('https://oauth2.googleapis.com/tokeninfo', [
                'id_token' => $credential,
            ]);

            if ($response->failed() || !$response->json('sub')) {
                \Log::error('Google One-Tap JWT verification failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return response()->json(['message' => 'Token Google invalide'], 401);
            }

            $data     = $response->json();
            $googleId = $data['sub'];
            $email    = $data['email'] ?? null;
            $name     = $data['name'] ?? ($data['given_name'] ?? 'Utilisateur');
            $avatar   = $data['picture'] ?? null;

        // ── Case 2 : OAuth2 access_token ────────────────────────────────
        } else {
            $isLocal    = app()->environment('local');
            $httpClient = $isLocal ? Http::withoutVerifying() : Http::withOptions([]);

            $response = $httpClient->withToken($request->access_token)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($response->failed() || !$response->json('sub')) {
                \Log::error('Google access_token verification failed', [
                    'status' => $response->status(),
                    'body'   => $response->body(),
                ]);
                return response()->json(['message' => 'Token Google invalide'], 401);
            }

            $data     = $response->json();
            $googleId = $data['sub'];
            $email    = $data['email'] ?? null;
            $name     = $data['name'] ?? 'Utilisateur';
            $avatar   = $data['picture'] ?? null;
        }

        if (!$email) {
            return response()->json(['message' => 'Email introuvable dans le token Google'], 422);
        }

        // ── Find or create user ─────────────────────────────────────────
        $user = User::where('google_id', $googleId)
                    ->orWhere('email', $email)
                    ->first();

        if ($user) {
            $user->update([
                'google_id'      => $googleId,
                'avatar'         => $avatar ?? $user->avatar,
                'email_verified' => true,
            ]);
        } else {
            $user = User::create([
                'name'           => $name,
                'email'          => $email,
                'google_id'      => $googleId,
                'avatar'         => $avatar,
                'password'       => bcrypt(Str::random(32)),
                'role'           => 'user',
                'email_verified' => true,
            ]);
        }

        $token = $user->createToken('google_auth')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user,
        ]);
    }
}

