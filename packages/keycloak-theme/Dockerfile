FROM quay.io/keycloak/keycloak:20.0.5

WORKDIR /opt/keycloak

COPY keycloak/europeana-realm.json ./data/import/

CMD ["start-dev", "--import-realm", "--http-relative-path", "/auth"]
