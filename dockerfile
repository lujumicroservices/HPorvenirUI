FROM node:latest as build

WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .
EXPOSE 80
RUN yarn run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html