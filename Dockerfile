# Multi-stage image to build and run europeana/portal.js

FROM node:14-alpine AS base

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY nuxt.config.js babel.config.cjs *.md .env.example ./
COPY src ./src


FROM base AS build

RUN npm run build


FROM build AS prune

RUN rm babel.config.cjs
RUN npm prune --production


FROM gcr.io/distroless/nodejs:14

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=prune /app .

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start"]
