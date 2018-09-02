FROM node:latest

WORKDIR /c:/Abschlussaufgabe_Graupner/uniplaner

COPY package.json /c:/Abschlussaufgabe_Graupner/uniplaner/package.json

RUN npm install

COPY . /c:/Abschlussaufgabe_Graupner/uniplaner

EXPOSE 3000

CMD ["npm", "start"]
