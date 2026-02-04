# Multi-stage image to build and run europeana/styleguide.js

ARG node_version=20

FROM node:${node_version}-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p styleguide packages/portal

COPY package*.json ./
COPY styleguide ./styleguide
COPY packages ./packages

RUN npm ci -w packages/portal
RUN npm --prefix ./styleguide ci ./styleguide

# RUN npm run build

RUN npm run styleguide:build


FROM nginx:stable-alpine

COPY --from=build /app/styleguide/dist /usr/share/nginx/html
