FROM node:6

WORKDIR /c:/Abschlussaufgabe_Graupner/uniplaner

COPY package.json /c:/Abschlussaufgabe_Graupner/uniplaner

RUN npm install

COPY . /c:/Abschlussaufgabe_Graupner/uniplaner

EXPOSE 3000

CMD ["npm", "start"]
