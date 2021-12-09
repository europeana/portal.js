#!/bin/sh

set -e

version=$(npm view @europeana/portal version)

for file in $(find .nuxt/dist/client -type f | sort); do
  url="https://cdn.jsdelivr.net/npm/@europeana/portal@${version}/${file}"
  echo ${url}
  wget -q ${url}
done
