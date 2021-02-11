# Builds and runs the app server for production.

FROM node:12-alpine

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production \
    CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE ${PORT}

WORKDIR /app

COPY . .

RUN NODE_ENV=dev && \
    npm install && \
    npm run build && \
    npm prune --production

CMD ["npm", "run", "start"]
