# Multi-stage image to build and run europeana/portal.js

FROM node:18-alpine AS base

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true \
    GECKODRIVER_SKIP_DOWNLOAD=true \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# RUN mkdir -p packages/portal
#
# COPY package*.json ./
# COPY packages/portal/package*.json ./packages/portal/
# COPY packages/mirador ./packages/mirador
# COPY packages/style ./packages/style
# COPY packages/vue-session-id ./packages/vue-session-id
#
# RUN npm -w packages/portal ci
#
# COPY *.md ./
# COPY packages/portal/*.js ./packages/portal/
# COPY packages/portal/src ./packages/portal/src
#
# RUN npm run build
# RUN rm -rf node_modules packages/*/node_modules packages/mirador packages/style
# RUN rm -rf packages/portal/src/lang
# RUN npm -w packages/portal ci --omit dev --omit peer


FROM gcr.io/distroless/nodejs:18

ENV PORT=8080 \
    HOST=0.0.0.0 \
    NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /app

COPY --from=prod-deps /app /app
COPY --from=build /app/.nuxt /app/.nuxt

USER 1000

CMD ["node_modules/.bin/nuxt-cli", "start", "./packages/portal"]
