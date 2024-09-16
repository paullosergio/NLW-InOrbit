FROM node:20.17-alpine
WORKDIR /app

COPY package*.json ./
COPY scripts/init.sh /app/scripts/init.sh

RUN npm install

COPY . .

EXPOSE 3333