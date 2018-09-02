# see: https://buddy.works/guides/how-dockerize-node-application
FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
EXPOSE 3000
CMD [“node”, “app.js”]