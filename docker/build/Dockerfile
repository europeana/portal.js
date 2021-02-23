# Builds and runs the app server for production.

FROM node:12-alpine

ENV PORT=8080
ENV HOST=0.0.0.0

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true
ENV GECKODRIVER_SKIP_DOWNLOAD=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

EXPOSE ${PORT}

WORKDIR /app

# TODO: git is only needed to install NPM packages direct from GitHub. Remove
#       when no longer needed.
RUN apk add --no-cache git

COPY . .

RUN npm install && \
    npm run build && \
    npm prune --production

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
