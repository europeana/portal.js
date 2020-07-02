#!/bin/sh

echo "Running for NODE_ENV=${NODE_ENV}"

env > .env

case ${NODE_ENV} in
  test) npm run build:test;;
  production) npm run build;;
esac

case ${NODE_ENV} in
  development) npm run dev "$@";;
  test|production) npm run start:cluster "$@";;
  *) echo "Unsupported NODE_ENV \"${NODE_ENV}\"" && exit 1;;
esac
