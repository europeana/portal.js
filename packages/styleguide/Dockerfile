# Multi-stage image to build and run europeana/styleguide.js

FROM node:16-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/styleguide

COPY package*.json ./
COPY packages/styleguide/package*.json ./packages/styleguide/

RUN npm ci -w packages/styleguide

COPY packages/styleguide ./packages/styleguide

RUN npm run styleguide:build


FROM nginx:stable

# COPY --from=build /app .
