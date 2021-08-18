FROM node:14.16.0

COPY package.json /package.json

RUN npm install

COPY . /

CMD ["node", "server.js"]