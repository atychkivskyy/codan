#!/bin/bash

touch mosquito.log

docker compose ../docker-compose.yml up -d

echo "Services started"