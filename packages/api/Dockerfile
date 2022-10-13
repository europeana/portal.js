# Multi-stage image to build and run europeana/portal-api

FROM node:16-alpine AS dependencies

WORKDIR /app

RUN mkdir -p packages/api

COPY package*.json ./
COPY packages/api/package*.json ./packages/api/

RUN npm ci -w packages/api

COPY LICENSE.md ./
COPY packages/api/src ./packages/api/src

RUN npm prune --omit dev


FROM gcr.io/distroless/nodejs:16

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=dependencies /app .

USER 1000

CMD ["packages/api/src/index.js"]
