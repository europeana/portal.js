#!/usr/bin/env bash

# Exit on error
set -e

# Enable globstar for recursive globs, e.g. in overlays sub-dirs
shopt -s globstar

# Set env defaults
K8S_DEPLOYMENT_CPU_LIMIT="${K8S_DEPLOYMENT_CPU_LIMIT:-200m}"
K8S_DEPLOYMENT_CPU_REQUEST="${K8S_DEPLOYMENT_CPU_REQUEST:-1m}"
K8S_DEPLOYMENT_MEMORY_LIMIT="${K8S_DEPLOYMENT_MEMORY_LIMIT:-200Mi}"
K8S_DEPLOYMENT_MEMORY_REQUEST="${K8S_DEPLOYMENT_MEMORY_REQUEST:-100Mi}"

# Create env-specific resources from templates
for template in **/*.template.*; do
  resource=$(echo ${template} | sed 's/\.template//')
  envsubst < ${template} > ${resource}
done

# Kustomize
kubectl kustomize "$@"

# Delete env-specific resources
for template in **/*.template.*; do
  resource=$(echo ${template} | sed 's/\.template//')
  rm ${resource}
done
