### What is Server-Side Request Forgery (SSRF)?

Server-Side Request Forgery (SSRF) is a vulnerability that allows an attacker to make the server-side application send HTTP requests to an arbitrary domain of the attacker's choosing. This can be used to:

- **Access internal services** that are not directly exposed to the internet
- **Bypass authentication** by accessing internal admin interfaces
- **Read sensitive files** from internal systems
- **Extract data** from internal databases or APIs

**How SSRF works:**
1. The application accepts a URL as a parameter (example: `?url=https://example.com`)
2. The server makes an HTTP request to that URL
3. The server processes the response (blind SSRF) or returns it to the user (non-blind SSRF)
4. An attacker replaces the URL with an internal address (example: `http://localhost/admin`)

**Common targets for SSRF:**
- `localhost` or `127.0.0.1` - the server itself
- `192.168.x.x` or `10.x.x.x` - internal network ranges
- `169.254.x.x` - AWS metadata service
- Internal APIs, databases, or admin panels
