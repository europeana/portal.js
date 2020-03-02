FROM node:12

ENV PORT=80

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY index.js ./

EXPOSE 80

CMD npm run start
