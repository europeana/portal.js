# Runs Nightwatch

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

COPY docker/nightwatch/package*.json docker/nightwatch/percy.js ./

RUN npm install

COPY features tests/features
COPY visual tests/visual

ENTRYPOINT ["npm", "run", "start"]
CMD ["tests/features"]
