# Multi-stage image to build and run europeana/portal.js

FROM node:16-alpine AS build

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN mkdir -p packages/portal

COPY package*.json ./
COPY packages/portal/package*.json ./packages/portal/

RUN npm ci -w packages/portal

COPY *.md ./
COPY packages/portal ./packages/portal

RUN npm run build
RUN npm prune --omit dev


FROM gcr.io/distroless/nodejs:16

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=build /app .

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
