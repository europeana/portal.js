# Multi-stage image to build and run europeana/portal.js

# 1. Build
FROM node:12-alpine

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# TODO: git is only needed to install NPM packages direct from GitHub. Remove
#       when no longer needed.
RUN apk add --no-cache git

COPY bin ./bin
COPY package.json package-lock.json ./

RUN npm install

COPY .babelrc .env.example nuxt.config.js *.md ./
COPY src ./src

RUN npm run build

RUN npm prune --production

# 2. Run
FROM node:12-alpine

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=0 /app .

CMD ["npm", "run", "start"]
