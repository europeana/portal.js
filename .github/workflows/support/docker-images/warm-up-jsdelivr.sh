#!/bin/sh

version=$(npm view @europeana/portal version)

apk add --no-cache curl

# Give jsDelivr time to fetch the new version
url="https://cdn.jsdelivr.net/npm/@europeana/portal@${version}"
cached=false
attempt=0
while [[ ${cached} == "false" ]]; do
  attempt=$(( attempt + 1 ))
  if [[ ${attempt} -gt 12 ]]; then
    echo "ERROR: Failed to detect version available on jsDelivr after 12 attempts."
    exit 1
  fi

  echo "Checking for version availability on jsDelivr, attempt #${attempt}"
  curl --fail --silent -o /dev/null -I "${url}"

  if [[ "$?" == "0" ]]; then
    echo "OK"
    echo
    cached=true
  else
    sleep 5
  fi
done

set -e
for file in $(find .nuxt/dist/client -type f | sort); do
  url="https://cdn.jsdelivr.net/npm/@europeana/portal@${version}/${file}"
  echo ${url}

  curl --fail --silent -o /dev/null -I "${url}"
done
