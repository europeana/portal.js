# Builds an image for running Nightwatch with Percy

# NB: check that the alpine version has the required version of node
#     @see https://pkgs.alpinelinux.org/package/v3.16/main/x86_64/nodejs
FROM alpine:3.16

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

RUN mkdir screenshots

COPY package*.json ./

RUN npm ci

COPY . .

ENTRYPOINT ["npm", "run", "start"]
CMD ["tests/**/*.feature"]
