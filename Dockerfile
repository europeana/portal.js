# Multi-stage image to build and run europeana/portal.js

# 0. Prevent re-installing npm packages on non-dependency changes to package.json
FROM alpine:3 AS package-json-stripped

WORKDIR /app

RUN apk add --no-cache jq

COPY package.json package-original.json
RUN jq -Mr '{dependencies,devDependencies}' package-original.json > package.json

COPY package-lock.json package-lock-original.json
RUN jq -Mr '{dependencies,lockfileVersion,requires}' package-lock-original.json > package-lock.json


# 1. Build production base image
FROM node:16-alpine AS production-package-install

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY --from=0 /app/package.json /app/package-lock.json ./

RUN NODE_ENV=production npm install


# 2. Build app files
FROM production-package-install AS production-app-build

RUN npm install

COPY babel.config.cjs .env.example nuxt.config.js package.json package-lock.json *.md ./
COPY bin ./bin
COPY src ./src

RUN npm run build
RUN rm -rf node_modules


# 3. Run
FROM production-package-install AS production-app-run

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=production-app-build /app .

CMD ["npm", "run", "start"]
