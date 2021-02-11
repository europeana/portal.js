FROM europeana/cf-blue-green-deploy:main

# openssh-client used by ELK registration command
RUN apk add -q nodejs npm openssh-client && \
    cf install-plugin app-autoscaler-plugin -f -r CF-Community

COPY deploy/cloud-foundry/hooks /hooks

COPY . .

RUN npm install && \
    npm run build

CMD ["deploy", "-f", "deploy/cloud-foundry/manifest.yml", "--vars-file", "/vars.yml"]
