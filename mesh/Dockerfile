FROM node:19-alpine3.15

COPY . ./
RUN apk add curl
RUN apk add --no-cache bash
RUN npm install .
ENV NODE_OPTIONS=--max_old_space_size=15000
RUN npm install .
CMD ["npm","run","mesh_dev"]
ENTRYPOINT ["./start.sh"]