FROM selenium/standalone-chrome:86.0

ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

HEALTHCHECK CMD curl -fs http://localhost:4444 || exit 1
