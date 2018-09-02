FROM node:6

WORKDIR \\desktop\\Abschlussaufgabe_Graupner\\uniplaner

COPY package.json \\desktop\\Abschlussaufgabe_Graupner\\uniplaner

RUN npm install

COPY . \\desktop\\Abschlussaufgabe_Graupner\\uniplaner

EXPOSE 3000

CMD ["npm", "start"]
