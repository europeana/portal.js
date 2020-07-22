FROM europeana/nginx-ssl-localhost

COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/* /etc/nginx/conf.d/
COPY templates/* /etc/nginx/templates/

EXPOSE 3000
EXPOSE 3001
