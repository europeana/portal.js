# Builds an image for running Nightwatch with Percy

FROM alpine:3

WORKDIR /app

# Tell Percy to use local Chromium
ENV PERCY_BROWSER_EXECUTABLE=/usr/bin/chromium-browser

# Install local Chromium and dependencies for puppeteer, used by Percy
# See: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-alpine
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      npm

COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start"]
CMD ["tests/**/*.feature"]
