FROM node:alpine

WORKDIR /app

ADD . /app

RUN npm i && cd client && npm i && cd ..

ENV NAME OtakuQuotes

CMD ["npm", "start"]
