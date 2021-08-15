FROM node:latest as build

WORKDIR /app
COPY package.json ./
RUN yarn install --legacy-peer-deps
COPY . .
EXPOSE 80
RUN npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html