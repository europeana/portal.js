# Multi-stage image to build and run europeana/portal-api

FROM node:16-alpine AS dependencies

WORKDIR /app

RUN mkdir -p packages/express

COPY LICENSE.md package*.json ./
COPY packages/express/package*.json ./packages/express/

RUN npm ci -w packages/express

COPY packages/express/src ./packages/express/src

RUN npm prune --omit dev


FROM gcr.io/distroless/nodejs:16

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=dependencies /app .

USER 1000

CMD ["packages/express/bin/start.js"]
