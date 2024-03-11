FROM nginx:stable

# builds will be run from the portal pkg base dir, so include full relative path
COPY docker/dataspace-culturalheritage/etc/nginx /etc/nginx
COPY dist /usr/share/nginx/html
