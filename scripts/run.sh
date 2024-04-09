#!/bin/bash

touch ./mosquitto/mosquitto.log

docker compose -f docker-compose.yaml up

echo "Services started"