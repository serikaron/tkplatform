FROM node as tk-node

ENV TZ=Asia/Hong_Kong
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "jest.config.js", "./"]

RUN npm install --omit=dev

FROM tk-node as service

ARG name

COPY common /app/common
COPY ${name} /app/${name}