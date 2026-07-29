curl -s "https://<lab-url>.web-security-academy.net/product/stock" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "stockApi=/product/stock/check?productId=1&storeId=1" | cat
