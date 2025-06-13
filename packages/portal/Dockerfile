# Multi-stage image to build and run europeana/portal.js

ARG node_version=20

FROM node:${node_version}-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/portal

COPY package*.json ./
COPY packages/ ./packages

RUN npm -w packages/portal ci

COPY *.md ./
COPY packages/portal/*.js ./packages/portal/
COPY packages/portal/src ./packages/portal/src

RUN npm run build
RUN rm -rf node_modules packages/*/node_modules packages/contentful packages/style
RUN rm -rf packages/portal/src/lang
RUN npm -w packages/portal ci --omit dev --omit peer


FROM gcr.io/distroless/nodejs${node_version}-debian12

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
