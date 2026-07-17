# Build stage
FROM node:26-alpine AS build

ARG VITE_API_URL=https://cronushub.ddns.net/wildledger-api/api/0.1.0
ARG BASE_URL=/wildledger/

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
