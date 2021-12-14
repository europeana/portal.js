# Multi-stage image to build and run europeana/portal.js

# 0. Prevent re-installing npm packages on non-dependency changes to package.json
#
# NB: this does not work as intended with Buildx due to its considering timestamps
# as well as file content for COPY instructions. See https://github.com/docker/docker.github.io/pull/13702
FROM alpine:3 AS package-json-stripped

WORKDIR /app

RUN apk add --no-cache jq

COPY package.json package-original.json
RUN jq -Mr '{dependencies,devDependencies}' package-original.json > package.json

COPY package-lock.json package-lock-original.json
RUN jq -Mr '{dependencies,lockfileVersion,requires}' package-lock-original.json > package-lock.json


# 1. Build production base image
FROM node:14-alpine AS production-package-install

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY --from=package-json-stripped /app/package.json /app/package-lock.json ./

RUN NODE_ENV=production npm install

COPY bin ./bin
COPY *.md .env.example ./


# 2. Copy app src
FROM production-package-install AS production-app-base

RUN npm install

COPY package.json package-lock.json .eslintrc.cjs .stylelintrc.cjs babel.config.cjs nuxt.config.js ./
COPY src ./src


# 3. Build app

FROM production-app-base AS production-app-build-nuxt

RUN npm run build


# 4. Run
FROM production-package-install AS production-app-run

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

COPY --from=production-app-build-nuxt /app/package.json /app/package-lock.json /app/nuxt.config.js ./
COPY --from=production-app-build-nuxt /app/src ./src
COPY --from=production-app-build-nuxt /app/.nuxt ./.nuxt

CMD ["npm", "run", "start"]
