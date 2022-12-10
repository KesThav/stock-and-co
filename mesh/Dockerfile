FROM node:19-alpine3.15

COPY . ./
RUN apk add curl
RUN apk add --no-cache bash
RUN npm install .

RUN npm install .
CMD ["npm","run","mesh_dev"]
ENTRYPOINT ["./start.sh"]