#!/bin/bash
set -v
if [ "${TRAVIS_PULL_REQUEST}" = "true" ]; then
  npm run test:ci:percy
else
  npm run test:ci
fi
