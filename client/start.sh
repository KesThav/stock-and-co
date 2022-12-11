#!/bin/bash

set -e

echo "check if mesh is up"
while [ "$(curl -s -o mysubhost.com --write-out '%{http_code}' --silent --output /dev/null http://mesh:4000)" != 302 ]
do echo "mesh not up yet..."
sleep 2
done

echo "Mesh up !"
echo "start Client !"
exec "$@"