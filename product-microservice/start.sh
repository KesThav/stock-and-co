#!/bin/bash

set -e

echo "check if camunda is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://camunda:8080/camunda)" != 302 ]
do echo "camunda not up yet..."
sleep 2
done

echo "Camunda up !"
echo "start gateway !"
exec "$@"