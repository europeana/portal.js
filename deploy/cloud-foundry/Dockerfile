FROM europeana/cf-blue-green-deploy:main

# openssh-client used by ELK registration command
RUN apk add -q openssh-client && \
    cf install-plugin app-autoscaler-plugin -f -r CF-Community

COPY deploy/cloud-foundry/hooks /hooks

CMD ["deploy", "-f", "deploy/cloud-foundry/manifest.yml", "--vars-file", "/vars.yml"]
