# Multi-stage image to build and run europeana/portal.js

FROM node:24-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/portal

COPY package*.json ./
COPY packages/portal/package*.json ./packages/portal/
COPY packages/i18n ./packages/i18n
COPY packages/style ./packages/style
COPY packages/vue-contentful-graphql ./packages/vue-contentful-graphql
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


FROM gcr.io/distroless/nodejs24-debian13@sha256:78f07ef1b5ea71ad7c055df15d0dd8997f2d288f9158623c4d4ae3d765b7d50d

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
