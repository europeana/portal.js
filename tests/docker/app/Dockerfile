# Builds and runs the app server for testing against, e.g. in e2e test runs.
#
# Assumes the provision of app files and installed Node modules, e.g. via
# a volume mounted at /app.

FROM node:12-alpine

ENV PORT=8080
ENV HOST=0.0.0.0

EXPOSE ${PORT}

WORKDIR /app

# Local bindings may not be suitable for the container
CMD npm rebuild node-sass && \
    npm run build:test && \
    npx cross-env NODE_ENV=test node server/index.js


# The following COPY, RUN and CMD commands would be used to install the package
# dependencies and build the app for production use. Left here for future
# reference.
#
# COPY . .
#
# RUN CHROMEDRIVER_SKIP_DOWNLOAD=true GECKODRIVER_SKIP_DOWNLOAD=true PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     npm install && \
#     npm run build && \
#     rm -rf node_modules && \
#     NODE_ENV=production npm install
#
# CMD NODE_ENV=production npm run start
