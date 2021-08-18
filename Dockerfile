FROM node:14.16.0

COPY package*.json ./

RUN npm install --only=production

COPY . ./

CMD ["node", "server.js"]