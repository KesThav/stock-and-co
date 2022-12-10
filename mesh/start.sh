#!/bin/bash

set -e

echo "Logs microservice is up !"
echo "Checking if order-microservice is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://order-microservice:8083)" != 200 ]
do echo "order-microservice not up yet..."
sleep 2
done

echo "Order microservice is up !"
echo "Checking if product-microservice is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://product-microservice:8084)" != 200 ]
do echo "product-microservice not up yet..."
sleep 2
done

echo "Product microservice is up !"
echo "Check if user-microservice is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://user-microservice:8082)" != 200 ]
do echo "user-microservice not up yet..."
sleep 2
done

echo "user microservice is up !"
echo "start order-service !"
exec "$@"