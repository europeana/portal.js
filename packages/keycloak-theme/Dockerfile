FROM quay.io/keycloak/keycloak:20.0.5

WORKDIR /opt/jboss/keycloak

COPY keycloak/disable-theme-cache.cli ../startup-scripts/disable-theme-cache.cli

CMD ["start-dev"]
