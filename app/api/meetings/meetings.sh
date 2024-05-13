#!/bin/bash

API_KEY_SECRET="mirotalksfu_default_secret"
MIROTALK_URL="https://sfu.mirotalk.com/api/v1/meetings"
#MIROTALK_URL="http://localhost:3010/api/v1/meetings"

curl $MIROTALK_URL \
    --header "authorization: $API_KEY_SECRET" \
    --header "Content-Type: application/json" \
    --request GET
