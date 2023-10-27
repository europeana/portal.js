#!/bin/bash
set -e

DB="europeana_www"

psql -v ON_ERROR_STOP=1 --dbname "${DB}" < /docker-entrypoint-initdb.d/db.psql
