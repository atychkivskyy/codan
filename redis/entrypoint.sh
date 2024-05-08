#!/bin/bash

redis-server  &

sleep 5

#Update with n of tokens
redis-cli SET tokens "$TOKENS"

tail -f /dev/null
