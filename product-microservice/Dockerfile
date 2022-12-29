FROM node:19-alpine3.15

COPY . ./
RUN apk add curl
RUN apk add --no-cache bash
RUN npm install .
ENV NODE_OPTIONS=--max_old_space_size=15000
EXPOSE 8084

CMD ["npm","start"]
ENTRYPOINT ["./start.sh"]