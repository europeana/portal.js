# Build nuxt.js with CLIs to deploy to S3 & Cloud Foundry

# TODO: publish image to Docker Hub; partial -- up to COPY -- for
#   a resuable base image for node apps to push to S3 & CF

FROM node:11

WORKDIR /app

ARG nuxt_env_build_public_path

# Install AWS & CF CLIs for user `node`
RUN apt-get -q update && apt-get -yq install apt-transport-https \
  && wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add - \
  && echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list \
  && apt-get -q update && apt-get -yq install python-pip cf-cli \
  && rm -rf /var/lib/apt/lists/* \
  && pip install awscli \
  && cf add-plugin-repo CF-Community https://plugins.cloudfoundry.org \
  && cf install-plugin blue-green-deploy -f -r CF-Community

# Install node.js packages
COPY package.json package-lock.json ./
RUN npm install --only=production

# Build nuxt.js with public path for assets from build arg
COPY . ./
RUN NUXT_ENV_BUILD_PUBLIC_PATH=${nuxt_env_build_public_path} npm run build

# By default the app will listen on 127.0.0.1 but for Docker needs to be 0.0.0.0
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
