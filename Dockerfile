# Multi-stage image to build and run europeana/portal.js

# 1.
FROM node:14-alpine AS run-base

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package.json package-lock.json ./
RUN NODE_ENV=production npm install


# 2.
FROM run-base AS build-base

RUN npm install

COPY .eslintrc.cjs .stylelintrc.cjs babel.config.cjs ./


# 3.
FROM build-base as build

COPY nuxt.config.js ./
COPY src ./src

RUN npm run build


# 4.
FROM run-base AS run

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

COPY bin ./bin
COPY nuxt.config.js *.md .env.example ./
COPY src ./src
COPY --from=build /app/.nuxt ./.nuxt

CMD ["npm", "run", "start"]
