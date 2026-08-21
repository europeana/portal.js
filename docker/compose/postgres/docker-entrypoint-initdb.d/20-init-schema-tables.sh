#!/bin/bash
set -e

for sql in /var/lib/postgresql/model/*.psql; do
  psql -v ON_ERROR_STOP=1 --dbname "${DB}" < ${sql}
done
