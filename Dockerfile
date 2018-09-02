# see: https://buddy.works/guides/how-dockerize-node-application
FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node app.js
EXPOSE 3000
