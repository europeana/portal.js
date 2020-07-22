#!/bin/sh

# TODO: remove when client-side bundle no longer relies on dotenv
env > .env

npm run build
npm run start:cluster "$@"
