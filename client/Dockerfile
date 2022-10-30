FROM node:19-alpine3.15

COPY . ./
RUN apk add curl
RUN apk add --no-cache bash
RUN npm install .

EXPOSE 3000

CMD ["npm","start"]
ENTRYPOINT ["./start.sh"]