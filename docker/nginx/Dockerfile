FROM nginx:stable

RUN apt-get update && \
    apt-get -y install openssl && \
    rm -rf /var/lib/apt/lists/*
RUN mkdir /etc/nginx/ssl && \
    openssl req -x509 -newkey rsa:2048 -nodes \
    -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.crt \
    -days 365 -subj "/CN=localhost"

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/* /etc/nginx/conf.d/

EXPOSE 80
EXPOSE 443
