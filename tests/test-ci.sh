#!/bin/bash
set -v
if [ "${TRAVIS_PULL_REQUEST}" = "false" ]; then
  npm run test:ci
else
  npm run test:ci:percy
fi
