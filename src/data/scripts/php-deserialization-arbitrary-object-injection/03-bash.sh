curl -s -D - "https://<lab-url>.web-security-academy.net/login" \
  -d "username=wiener&password=peter" 2>/dev/null | head -10
