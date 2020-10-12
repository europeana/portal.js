# Builds and runs the app server for testing against, e.g. in e2e test runs.
#
# Assumes the provision of pre-installed Node modules at /app/node_modules/,
# e.g. via a mounted volume.

FROM node:12-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start"]
