FROM node:12

ENV PORT=80
ENV HOST=0.0.0.0

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# TODO: rerun npm install with NODE_ENV=production to remove dev dependencies

EXPOSE ${PORT}

CMD NODE_ENV=production npm run start
