FROM node:latest as build

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
EXPOSE 80
RUN npm install -g yarn --force
RUN yarn run build

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
