# Multi-stage image to build and run europeana/portal.js

# Packager
#
# Prevents re-installing npm packages on non-dependency changes to package.json
FROM alpine:3 AS packager

WORKDIR /app

RUN apk add --no-cache jq

COPY package.json package-original.json

RUN jq -Mr '{dependencies,devDependencies}' package-original.json > package.json


# Builder
FROM node:14-alpine AS builder

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# TODO: git is only needed to install NPM packages direct from GitHub. Remove
#       when no longer needed.
RUN apk add --no-cache git

COPY bin ./bin
COPY --from=packager /app/package.json .
COPY package-lock.json ./

RUN npm install

COPY babel.config.js .env.example nuxt.config.js package.json *.md ./
COPY src ./src

RUN npm run build


# Tester
FROM builder as tester

COPY .stylelintrc.js .eslintrc.js ./
COPY tests ./tests

CMD ["npm", "run", "test:unit"]


# Pruner
#
# Removes packages not needed for production
FROM builder AS pruner

RUN npm prune --production


# 3. Runner
FROM node:14-alpine AS runner

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=pruner /app .

CMD ["npm", "run", "start"]
