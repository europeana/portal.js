# Runs Nightwatch

# Use published image built from ../nightwatch-base/Dockerfile
FROM europeana/portal.js-nightwatch:master

COPY package*.json ./
RUN npm install

COPY . .

ENTRYPOINT ["npm", "run", "start"]
CMD ["tests/**/*.feature"]
