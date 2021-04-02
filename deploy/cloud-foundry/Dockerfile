FROM europeana/cf-blue-green-deploy:main

ENV CF_APP_TYPE=buildpack

# openssh-client used by ELK registration command
RUN apk add --no-cache -q openssh-client

COPY hooks /hooks

CMD ["deploy", "-f", "deploy/cloud-foundry/manifest.yml", "--vars-file", "/vars.yml"]
