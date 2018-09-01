FROM node:6

WORKDIR /C:/Abschlussaufgabe_Graupner/uniplaner

COPY package.json /C:/Abschlussaufgabe_Graupner/uniplaner

RUN npm install

COPY . /C:/Abschlussaufgabe_Graupner/uniplaner

EXPOSE 3000

CMD ["npm", "start"]
