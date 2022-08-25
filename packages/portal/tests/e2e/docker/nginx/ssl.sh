#!/bin/sh

mkdir -p /etc/nginx/ssl

openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt \
  -days 365 -subj "/CN=localhost"
