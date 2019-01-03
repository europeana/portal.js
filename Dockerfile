FROM node:10-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY . ./
RUN npm run build

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
