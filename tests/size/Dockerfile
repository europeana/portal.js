FROM node:14-alpine

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start"]
