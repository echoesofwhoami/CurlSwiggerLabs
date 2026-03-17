### ¿Qué es Redirección Abierta?

La redirección abierta es una vulnerabilidad donde una aplicación acepta entrada controlada por el usuario que determina dónde redirigir al usuario, sin validar adecuadamente la URL de destino. Esto permite a los atacantes redirigir usuarios a sitios web maliciosos.

**Cómo funciona la redirección abierta:**
1. La aplicación tiene un endpoint de redirección como `?redirect=https://example.com`
2. El valor del parámetro se usa directamente en una cabecera `Location` o redirección JavaScript
3. El atacante reemplaza la URL con un sitio malicioso
4. Los usuarios son redirigidos al sitio del atacante

**Patrones vulnerables comunes:**
```
GET /redirect?url=https://<attacker-domain>.com
GET /login?return=https://<attacker-domain>.com
GET /next?target=https://<attacker-domain>.com
```

**Por qué la redirección abierta es peligrosa:**
- **Ataques de phishing** - redirigir usuarios a páginas de login falsas
- **Evadir filtros** - usar el dominio legítimo para evadir filtros de URL
- **Ataques encadenados** - combinar con otras vulnerabilidades como SSRF
