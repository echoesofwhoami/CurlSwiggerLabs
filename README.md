# CurlSwiggerLabs

This repository contains writeups and solutions for PortSwigger Web Security Academy lab exercises but using basic tools instead of Burp Suite for the sheer enjoyment of learning and understanding web security, I know it's terribly unpractical but it's also more fun and challenging.

At the end of the writeup, I'll explain the developer approach to mitigate these vulnerabilities.

## Documented Labs

This section contains solutions and explanations for various PortSwigger Web Security Academy labs. Each lab includes a link to its detailed documentation in the `docs` directory.

## Writeups

- SSRF
    - [SSRF Filter Bypass via Open Redirection Lab](docs/ssrf-filter-bypass-open-redirection.md)

- Object Injection (PHP)
    - [Arbitrary Object Injection in PHP (Insecure Deserialization)](docs/php-deserialization-arbitrary-object-injection.md)

## Local Development Setup

### One-time Setup
```bash
# Build Docker image with dependencies (first time only)
docker-compose build
```

### Daily Development
1. **Start development server**
   ```bash
   docker-compose up
   ```
   The site will be available at `http://localhost:4321`.

2. **Stop server**
   ```bash
   docker-compose down
   ```

3. **Rebuild if dependencies change**
   ```bash
   docker-compose up --build
   ```