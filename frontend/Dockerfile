# Build stage
FROM node:26-alpine AS build

ARG VITE_API_URL
ARG BASE_URL

ENV VITE_API_URL=$VITE_API_URL
ENV BASE_URL=$BASE_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run stage
FROM nginx:alpine

RUN touch /var/run/nginx.pid

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
