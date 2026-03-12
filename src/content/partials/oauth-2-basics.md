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
