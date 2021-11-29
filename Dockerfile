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

COPY package.json package-lock.json babel.config.cjs nuxt.config.js ./
COPY src ./src


# Build app

FROM production-app-base AS production-app-build

RUN npm run build


# 3. Run
FROM production-package-install AS production

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

COPY --from=production-app-build /app/package.json /app/package-lock.json /app/nuxt.config.js ./
COPY --from=production-app-build /app/src ./src
COPY --from=production-app-build /app/.nuxt ./.nuxt

CMD ["npm", "run", "start"]


# 4. Unit test
FROM production-app-base AS test-unit

COPY .eslintrc.cjs .stylelintrc.cjs babel.config.cjs ./
COPY tests ./tests

CMD ["npm", "run", "test:unit"]


# Size test
FROM production-app-build AS test-size

COPY tests ./tests

RUN npm run test:size:setup

CMD ["npm", "run", "test:size"]


# 5.
FROM production AS final
