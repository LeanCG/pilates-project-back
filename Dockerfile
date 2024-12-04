FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --produccion

COPY . .


EXPOSE 3000

ENTRYPOINT ["sh", "/usr/src/app/entrypoint.sh"]