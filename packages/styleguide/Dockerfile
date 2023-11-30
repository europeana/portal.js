# Multi-stage image to build and run europeana/styleguide.js

FROM node:18-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/styleguide packages/portal

COPY package*.json ./
COPY packages/portal/package.json ./packages/portal/
COPY packages/iiif ./packages/iiif
COPY packages/style ./packages/style
COPY packages/styleguide/package.json ./packages/styleguide/
COPY packages/vue-session ./packages/vue-session

RUN npm ci -w packages/portal -w packages/styleguide

COPY packages/styleguide/style* ./packages/styleguide/

# TODO: copy from pre-built portal image instead? e.g.
# COPY --from=europeana/portal.js:master /app/packages/portal ./packages/portal
COPY packages/portal/*.js ./packages/portal/
COPY packages/portal/docs ./packages/portal/docs
COPY packages/portal/src ./packages/portal/src

RUN npm run build

RUN npm run styleguide:build


FROM nginx:stable-alpine

COPY --from=build /app/packages/styleguide/dist /usr/share/nginx/html
