#!/bin/bash

touch ./mosquitto/mosquitto.log

docker compose -f ../docker-compose.yml up

echo "Services started"