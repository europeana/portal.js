FROM europeana/cf-blue-green-deploy:main

RUN apk add -q nodejs npm && \
    cf install-plugin app-autoscaler-plugin -f -r CF-Community && \
    mv /docker-entrypoint /docker-entrypoint-upstream

COPY deploy/cloud-foundry/docker-entrypoint /docker-entrypoint

COPY . .

RUN npm install && \
    npm run build

CMD ["deploy", "-f", "deploy/cloud-foundry/manifest.yml", "--vars-file", "/vars.yml"]
