# Multi-stage image to build and run europeana/portal.js

ARG node_version=20

FROM node:${node_version}-alpine AS build

# QUESTION: are these still relevant?
ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN apk add pnpm

RUN mkdir -p packages/portal

COPY package.json pnpm-* ./
COPY packages/portal/package*.json ./packages/portal/
COPY packages/i18n ./packages/i18n
COPY packages/style ./packages/style
COPY packages/vue-router-query ./packages/vue-router-query
COPY packages/vue-session ./packages/vue-session
COPY packages/vue-visible-on-scroll ./packages/vue-visible-on-scroll

RUN pnpm install

COPY *.md ./
COPY packages/portal/*.js ./packages/portal/
COPY packages/portal/src ./packages/portal/src

RUN pnpm build
RUN rm -rf packages/style packages/portal/src/lang node_modules
RUN pnpm install --prod


FROM gcr.io/distroless/nodejs${node_version}-debian12

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
