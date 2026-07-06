<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureEmailVerified
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && !$user->email_verified) {
            return response()->json([
                'message'      => 'Email non vérifié. Veuillez vérifier votre adresse email.',
                'otp_required' => true,
                'email'        => $user->email,
            ], 403);
        }

        return $next($request);
    }
}
