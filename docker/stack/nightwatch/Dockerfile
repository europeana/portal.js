# Runs Nightwatch

FROM alpine:3

WORKDIR /app

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

# Tell puppeteer to use local Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY docker/stack/nightwatch/package*.json ./

RUN npm install

COPY tests/features tests/features
COPY tests/visual tests/visual

ENTRYPOINT ["npm", "run", "start"]
CMD ["tests/features"]
