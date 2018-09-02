FROM node:8
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node routes/index.js
EXPOSE 3000
