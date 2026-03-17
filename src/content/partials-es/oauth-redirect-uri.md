---
---

### ¿Por qué es Crítica la Validación de redirect_uri?

El parámetro `redirect_uri` especifica dónde el proveedor OAuth debe enviar el código de autorización después de la autenticación del usuario. Sin validación estricta, un atacante puede modificar este parámetro para apuntar a un servidor que controla. Cuando la víctima se autentica, su código de autorización es interceptado por el atacante en lugar de ser entregado a la aplicación legítima.

**En términos de OAuth:**
- **Seguro**: El proveedor OAuth solo redirige a URLs pre-registradas (como `https://<blog>.com/oauth-callback`)
- **Vulnerable**: El proveedor OAuth redirige a cualquier URL que el atacante proporcione (como `https://<attacker-site>.com/steal-code`)

**¿Por qué es tan peligroso?** Los códigos de autorización son **bearer tokens**. Quien tenga el código puede intercambiarlo por acceso a la cuenta de la víctima. Es como encontrar las llaves del coche de alguien. Si las tienes, puedes conducir el coche.
