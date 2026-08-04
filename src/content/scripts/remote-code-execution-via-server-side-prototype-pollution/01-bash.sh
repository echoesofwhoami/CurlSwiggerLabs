curl -s -D - "$BASE_LAB_URL/login" | grep -iE 'set-cookie|csrf'
