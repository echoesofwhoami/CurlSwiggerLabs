curl -s \
  -b "session=<session-cookie>" \
  -d '{"csrf":"<csrf-token>","sessionId":"<session-cookie>","tasks":["db-cleanup","fs-cleanup"]}' \
  "$BASE_LAB_URL/admin/jobs"
