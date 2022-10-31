#!/bin/bash

set -e

echo "check if camunda is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://camunda:8080/camunda)" != 302 ]
do echo "camunda not up yet..."
sleep 2
done

echo "Camunda up !"
echo "Checking if mongo-express for order-microservice is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://mongo-order-microservice:9002)" != 200 ]
do echo "mongo-express for order-microservice not up yet..."
sleep 2
done
echo "start order-service !"
exec "$@"