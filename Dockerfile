FROM node:8.11

WORKDIR /app
RUN npm install -g mocha
RUN npm install -g db-migrate
RUN npm install -g db-migrate-pg

COPY package.json .
RUN npm install

COPY . .