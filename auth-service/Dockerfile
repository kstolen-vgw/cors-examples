FROM node:16-alpine3.16 AS base

FROM base as build 
WORKDIR /build

COPY package*.json ./

RUN npm ci 

FROM base as run 
WORKDIR /app

COPY --from=build /build/node_modules ./node_modules
COPY package.json ./
COPY index.js ./

CMD ["node", "."]