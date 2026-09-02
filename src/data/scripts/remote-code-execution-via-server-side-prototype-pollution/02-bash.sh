curl -s -D - \
  -b "session=<session-cookie>" \
  -d '{"csrf":"<csrf-token>","username":"wiener","password":"peter"}' \
  "$BASE_LAB_URL/login"
