# Builds and runs the app server for testing against, e.g. in e2e test runs.
#
# Assumes the provision of pre-installed Node modules at /app/node_modules/,
# e.g. via a mounted volume.

FROM node:12-alpine

ENV PORT=8080
ENV HOST=0.0.0.0
ENV NODE_ENV=development

EXPOSE ${PORT}

WORKDIR /app

COPY . .

ENTRYPOINT ["/app/docker/stack/app/docker-entrypoint.sh"]
