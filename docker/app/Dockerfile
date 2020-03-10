FROM node:12-alpine

ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE ${PORT}

WORKDIR /app

COPY . .

RUN CHROMEDRIVER_SKIP_DOWNLOAD=true GECKODRIVER_SKIP_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    npm install && \
    npm run build && \
    rm -rf node_modules && \
    NODE_ENV=production npm install

CMD NODE_ENV=production npm run start
