<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->header('Accept-Language', $request->input('lang', config('app.locale')));

        $supported = ['fr', 'en', 'ar', 'es'];

        if (in_array($locale, $supported)) {
            app()->setLocale($locale);
        } else {
            // Try to match first two characters
            $short = substr($locale, 0, 2);
            if (in_array($short, $supported)) {
                app()->setLocale($short);
            }
        }

        return $next($request);
    }
}
