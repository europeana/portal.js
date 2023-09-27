# Multi-stage image to build and run europeana/portal.js

FROM node:18-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/portal

COPY package*.json ./
COPY packages/portal/package*.json ./packages/portal/
COPY packages/mirador ./packages/mirador
COPY packages/style ./packages/style
COPY packages/vue-session-id ./packages/vue-session-id

RUN npm -w packages/portal ci

COPY *.md ./
COPY packages/portal/*.js ./packages/portal/
COPY packages/portal/src ./packages/portal/src

RUN npm run build
RUN rm -rf node_modules packages/*/node_modules packages/mirador packages/style
RUN rm -rf packages/portal/src/lang
RUN npm -w packages/portal ci --omit dev --omit peer


# FROM nginx:stable-alpine AS assets
#
# COPY --from=build /app/packages/portal/.nuxt/dist/client /usr/share/nginx/html/.nuxt


FROM node:18-alpine

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .
COPY docker-entrypoint.sh /

USER 1000

RUN mkdir -p /usr/share/nginx/html

ENTRYPOINT docker-entrypoint.sh

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
