FROM alpine:3

RUN apk add --update nodejs npm

COPY package* .

RUN npm install

RUN rm -rf /tmp/* /root/.npm

COPY . .

CMD npm run test
