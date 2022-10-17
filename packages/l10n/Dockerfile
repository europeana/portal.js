# Multi-stage image to build and run europeana/portal-l10n

FROM node:16-alpine AS dependencies

WORKDIR /app

RUN mkdir -p packages/express packages/i18n packages/l10n

COPY LICENSE.md package*.json ./
COPY packages/express/ ./packages/express/
COPY packages/i18n/ ./packages/i18n/
COPY packages/l10n/package.json ./packages/l10n/

RUN npm ci -w packages/l10n

COPY packages/l10n/ ./packages/l10n/

RUN npm prune --omit dev


FROM gcr.io/distroless/nodejs:16

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=dependencies /app .

USER 1000

CMD ["packages/l10n/bin/start.js"]
