FROM nginx:stable-alpine

RUN apk add --no-cache openssl

COPY ssl.sh /docker-entrypoint.d/
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/* /etc/nginx/conf.d/

COPY tmp/docker_nginx-proxy-cache-apis/_data /var/cache/nginx/proxy/apis

EXPOSE 80
EXPOSE 443
