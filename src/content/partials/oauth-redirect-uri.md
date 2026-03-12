---
---

### Why is redirect_uri Validation Critical?

The `redirect_uri` parameter specifies where the OAuth provider should send the authorization code after user authentication. Without strict validation, an attacker can modify this parameter to point to a server they control. When the victim authenticates, their authorization code is intercepted by the attacker instead of being delivered to the legitimate application.

**In OAuth terms:**
- **Secure**: The OAuth provider only redirects to pre-registered URLs (like `https://blog.com/oauth-callback`)
- **Vulnerable**: The OAuth provider redirects to whatever URL the attacker provides (like `https://evil-site.com/steal-code`)

**Why is this so dangerous?** Authorization codes are **bearer tokens**. Whoever has the code can exchange it for access to the victim's account. It's like finding someone's car keys. If you have them, you can drive the car.
