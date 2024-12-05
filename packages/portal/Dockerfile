# Multi-stage image to build and run europeana/portal.js

FROM node:18-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/portal

COPY package*.json ./
COPY packages/portal/package*.json ./packages/portal/
COPY packages/i18n ./packages/i18n
COPY packages/oembed ./packages/oembed
COPY packages/style ./packages/style
COPY packages/vue-router-query ./packages/vue-router-query
COPY packages/vue-session ./packages/vue-session
COPY packages/vue-visible-on-scroll ./packages/vue-visible-on-scroll

RUN npm -w packages/portal ci

COPY *.md ./
COPY packages/portal/*.js ./packages/portal/
COPY packages/portal/src ./packages/portal/src

RUN npm run build
RUN rm -rf node_modules packages/*/node_modules packages/style
RUN rm -rf packages/portal/src/lang
RUN npm -w packages/portal ci --omit dev --omit peer


FROM gcr.io/distroless/nodejs:18

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
