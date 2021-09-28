FROM node:14.17.0-alpine as base

RUN apk add --no-cache -t build-dependencies make gcc g++ python libtool autoconf automake 

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

FROM node:14.17.0-alpine AS dev

WORKDIR /backend

COPY --from=base /backend/ ./

RUN apk update && apk --no-cache add ca-certificates
RUN apk --no-cache add bash

RUN addgroup powuser && adduser -D -G powuser powuser \
  && chown -R powuser:powuser /backend 

EXPOSE 5000

CMD ["node", "index.js"]