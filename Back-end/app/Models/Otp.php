<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Otp extends Model
{
    protected $fillable = [
        'email',
        'code',
        'type',
        'used',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    /**
     * Check if OTP is still valid (not expired, not used).
     */
    public function isValid(): bool
    {
        return !$this->used && $this->expires_at->isFuture();
    }

    /**
     * Generate a 6-digit OTP and store it.
     */
    public static function generate(string $email, string $type = 'email_verification'): self
    {
        // Invalidate all previous OTPs for this email+type
        self::where('email', $email)->where('type', $type)->delete();

        return self::create([
            'email'      => $email,
            'code'       => str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT),
            'type'       => $type,
            'used'       => false,
            'expires_at' => now()->addMinutes(10),
        ]);
    }
}
