FROM node:16-alpine AS build-theme

ARG theme_workspace=packages/keycloak-theme
ARG portal_workspace=packages/portal

WORKDIR /theme

RUN mkdir -p ${theme_workspace} ${portal_workspace}

COPY package*.json ./
COPY ${theme_workspace}/package*.json ./${theme_workspace}/
COPY ${portal_workspace} ./${portal_workspace}

RUN npm -w ${theme_workspace} ci

COPY ${theme_workspace} ./${theme_workspace}

RUN npm run -w ${theme_workspace} build


FROM quay.io/keycloak/keycloak:20.0.5 AS build-keycloak

ARG theme_workspace=packages/keycloak-theme

WORKDIR /opt/keycloak

COPY --from=build-theme /theme/${theme_workspace}/theme ./themes/europeana
COPY ${theme_workspace}/keycloak/keycloak.conf ./conf/

RUN /opt/keycloak/bin/kc.sh build --http-relative-path=/auth


FROM quay.io/keycloak/keycloak:20.0.5

ARG theme_workspace=packages/keycloak-theme

WORKDIR /opt/keycloak

COPY --from=build-keycloak /opt/keycloak ./
COPY ${theme_workspace}/keycloak/europeana-realm.json ./data/import/

CMD ["start", "--optimized", "--import-realm"]
