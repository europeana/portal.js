# Multi-stage image to build and run europeana/portal.js

FROM node:16.13-alpine AS base

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY bin ./bin
COPY package.json package-lock.json ./

RUN npm ci

COPY nuxt.config.js pkg-versions.js babel.config.cjs jest.config.js *.md .env.example ./
COPY src ./src
COPY styleguide ./styleguide


FROM base AS build

RUN npm run build
RUN rm -r babel.config.cjs jest.config.js bin styleguide
RUN npm prune --production


# FIXME: ideally we would always use the latest version of Node 16, from the
#        distroless image `gcr.io/distroless/nodejs:16`, but as of 16.14 that
#        encounters issues with our imports of .json files. Locked to 16.13
#        on the non-distroless image as a temporary workaround.
FROM node:16.13-alpine

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .

USER 1000

CMD ["node", "node_modules/.bin/nuxt-cli", "start"]
