FROM node

ADD . /app

WORKDIR /app

RUN npm install

EXPOSE 5000

CMD sleep 5 && node route_angmongo.js
