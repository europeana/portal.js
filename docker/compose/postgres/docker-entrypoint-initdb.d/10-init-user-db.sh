#!/bin/bash
set -e

DB="europeana_www"

psql -v ON_ERROR_STOP=1 --dbname "${POSTGRES_DB}" <<-EOSQL
	CREATE DATABASE ${DB};
	GRANT ALL PRIVILEGES ON DATABASE ${DB} TO ${POSTGRES_USER};
EOSQL
