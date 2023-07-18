FROM bitnami/kubectl:1.27

WORKDIR /k8s

USER root

# Install envsubst
RUN apt-get update && apt-get install -y gettext-base && apt-get clean

ENTRYPOINT ["/kustomize.sh"]
CMD ["base"]

COPY kustomize.sh /

COPY . .
