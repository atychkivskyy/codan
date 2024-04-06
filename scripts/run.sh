#!/bin/bash

touch ./mosquitto/mosquitto.log

docker compose ../docker-compose.yml up -d

echo "Services started"