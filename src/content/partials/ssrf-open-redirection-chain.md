### Open Redirection + SSRF Chain Attack

When an application can make arbitrary requests with SSRF protections and also has an open redirection vulnerability, attackers can chain these to bypass the SSRF filters:

**Example attack flow:**
1. **SSRF protection blocks**: `http://localhost/admin` - direct internal URLs are filtered
2. **But allows**: `https://<victim-domain>/redirect?url=http://localhost/admin` - external domains (victim's domain) pass validation
3. **Open redirection redirects**: The victim's site redirects the request to the internal target since it's made server-side
4. **Result**: SSRF to internal admin interface bypassed through request redirection making the internal request

**Why this works:**
- The SSRF filter only checks if the initial URL is "safe" (external domain)
- It doesn't follow redirects to see the final destination
- The open redirection vulnerability acts as a proxy to reach internal targets