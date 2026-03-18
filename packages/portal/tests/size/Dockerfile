ARG node_version=20

FROM node:${node_version}-alpine

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

RUN apk add pnpm

COPY package.json pnpm-*.yaml ./

RUN pnpm install

CMD ["npm", "run", "start"]
