FROM node:10-alpine

WORKDIR /app

ARG nuxt_env_build_public_path

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . ./
RUN NUXT_ENV_BUILD_PUBLIC_PATH=${nuxt_env_build_public_path} npm run build

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
