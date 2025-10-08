set -e

# replace uselessly escaped slashes in .js downloads from Lokalise pull
# GitHub action, i.e. replace "\/" with "/"
sed -i 's/\\\//\//g' packages/portal/src/i18n/lang/*.js
