# Multi-stage image to build and run europeana/styleguide.js

ARG node_version=24

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


FROM nginx:stable-alpine@sha256:3bc3836dc0be3b811f238210360bf8e7ca8a2d0effdae46160bf1f3578710051

COPY --from=build /app/styleguide/dist /usr/share/nginx/html
