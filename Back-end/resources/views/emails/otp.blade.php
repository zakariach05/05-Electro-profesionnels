<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{ $subject }}</title>
</head>

<body style="margin:0;padding:0;background:#0f172a;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
          style="background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:24px;overflow:hidden;border:1px solid rgba(59,130,246,0.2);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#3b82f6,#6366f1);padding:36px 40px;text-align:center;">
              @php
                  $logoPath = public_path('Logo.png');
              @endphp
              @if(file_exists($logoPath) && isset($message))
                  <img src="{{ $message->embed($logoPath) }}" alt="Electro-05" style="height: 65px; width: auto; display: block; margin: 0 auto; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
              @else
                  <div style="font-size:32px;font-weight:900;color:#fff;letter-spacing:-1px;">⚡ Electro-05</div>
              @endif
              <div
                style="color:rgba(255,255,255,0.9);font-size:14px;margin-top:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">
                Électronique Professionnelle</div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#f1f5f9;font-size:22px;font-weight:700;margin:0 0 12px;">{{ $subject }}</h2>
              <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 32px;">
                Votre code de vérification à usage unique est :
              </p>
              <!-- OTP Code Box -->
              <div
                style="background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.15));border:2px solid rgba(59,130,246,0.4);border-radius:16px;padding:28px;text-align:center;margin-bottom:32px;">
                <div
                  style="font-size:48px;font-weight:900;letter-spacing:16px;color:#60a5fa;font-family:'Courier New',monospace;">
                  {{ $code }}</div>
              </div>
              <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 8px;">
                ⏱️ Ce code expire dans <strong style="color:#f1f5f9;">10 minutes</strong>.
              </p>
              <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">
                🔒 Ne partagez jamais ce code. Electro-05 ne vous demandera jamais votre code par email ou téléphone.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td
              style="background:rgba(255,255,255,0.03);padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="color:#475569;font-size:12px;text-align:center;margin:0;">
                Si vous n'avez pas demandé ce code, ignorez cet email.<br />
                © 2026 Electro-05 · Tous droits réservés
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

</html>