FROM node:latest as build

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
EXPOSE 80
<<<<<<< HEAD
RUN npm install -g yarn
=======
RUN npm install -g yarn --force
>>>>>>> c420c049de6c3a13a642f2c6f96f15833aa951f4
RUN yarn run build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
