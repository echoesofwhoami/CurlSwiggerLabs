### What is Open Redirection?

Open redirection is a vulnerability where an application accepts user-controlled input that determines where to redirect the user, without properly validating the destination URL. This allows attackers to redirect users to malicious websites.

**How open redirection works:**
1. Application has a redirect endpoint like `?redirect=https://example.com`
2. The parameter value is used directly in a `Location` header or JavaScript redirect
3. Attacker replaces the URL with a malicious site
4. Users are redirected to the attacker's site

**Common vulnerable patterns:**
```
GET /redirect?url=https://evil.com
GET /login?return=https://evil.com
GET /next?target=https://evil.com
```

**Why open redirection is dangerous:**
- **Phishing attacks** - redirect users to fake login pages
- **Bypassing filters** - use the legitimate domain to bypass URL filters
- **Chain attacks** - combine with other vulnerabilities like SSRF