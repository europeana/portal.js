# Multi-stage image to build and run europeana/portal-legacy-redirects

FROM node:16-alpine AS dependencies

WORKDIR /app

RUN mkdir -p packages/constants packages/express packages/legacy-redirects

COPY LICENSE.md package*.json ./
COPY packages/constants/ ./packages/constants/
COPY packages/express/ ./packages/express/
COPY packages/legacy-redirects/package.json ./packages/legacy-redirects/

RUN npm ci -w packages/legacy-redirects

COPY packages/legacy-redirects/ ./packages/legacy-redirects/

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
