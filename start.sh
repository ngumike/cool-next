#!/bin/bash

# Into context
cd /var/www/cool/app 

docker-compose -f docker-compose.prod.yml up --no-deps --build -d

rm -rf .git*

docker system prune -a -f