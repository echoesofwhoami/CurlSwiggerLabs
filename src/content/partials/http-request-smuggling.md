---
title: "HTTP Request Smuggling Basics"
category: "Fundamentals"
---

### What is HTTP Request Smuggling?

HTTP request smuggling tricks a site into mixing up where one HTTP request ends and the next one starts.

Most apps sit behind a front-end (proxy / load balancer) that forwards traffic to a back-end. For speed, the front-end often sends several HTTP/1 requests over the same connection. That only works if both servers agree on where each request stops.

**Why HTTP/1 can be unclear:**

HTTP/1 has two ways to say how long the body is:

1. **`Content-Length`**: exact size in bytes
2. **`Transfer-Encoding: chunked`**: body sent in pieces, ending with a zero-size chunk (`0\r\n\r\n`)

If both headers are present and disagree, one server may use `Content-Length` and the other `Transfer-Encoding`. The attacker can then hide extra bytes that the back-end treats as the start of the *next* request.

**Classic variants:**

| Variant | Front-end uses | Back-end uses |
|---------|----------------|---------------|
| **CL.TE** | `Content-Length` | `Transfer-Encoding` |
| **TE.CL** | `Transfer-Encoding` | `Content-Length` |
| **TE.TE** | Both support TE, but one can be tricked with a weird TE header | |

**Impact can include:**

- Bypassing front-end security controls (rules on the proxy never see the hidden inner request)
- Poisoning other users' requests / responses (leftover bytes get stuck onto someone else's next request)
- Stealing credentials, tokens, or poisoning caches (capture or rewrite what another user sends or receives)
- Reaching privileged endpoints (e.g. hide `GET /internal` so the back-end sees it while the front-end only allowed `/`, skipping path rewrites or auth headers the front-end would have added)
