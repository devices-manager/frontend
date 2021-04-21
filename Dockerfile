FROM node:erbium AS base

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY ./ /app/

ARG configuration=production

RUN cd /app && npm run build --prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:alpine AS build

RUN rm -rf /usr/share/nginx/html/*

COPY --from=base /app/dist /usr/share/nginx/html

COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf

RUN cat /etc/nginx/conf.d/default.conf
