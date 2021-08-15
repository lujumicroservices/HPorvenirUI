FROM node:latest

WORKDIR /app
COPY package.json ./
RUN yarn install --legacy-peer-deps
COPY . .
EXPOSE 80
CMD yarn run start