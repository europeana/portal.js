#!/bin/sh

echo "Running for NODE_ENV=${NODE_ENV}"

env > .env

case ${NODE_ENV} in
  development) npm run dev "$@";;
  test|production) node server/index.js "$@";;
  *) echo "Unsupported NODE_ENV \"${NODE_ENV}\"" && exit 1;;
esac
