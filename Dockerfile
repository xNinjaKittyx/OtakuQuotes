FROM node:latest
ENV NPM_CONFIG_LOGLEVEL info

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

RUN mkdir -p /tmp/client/
ADD client/package.json /tmp/client/package.json
RUN cd /tmp/client && npm install
RUN mkdir -p /opt/app/client && cp -a /tmp/client/node_modules /opt/app/client

WORKDIR /opt/app
ADD . /opt/app

RUN cd /opt/app/client && npm run-script build && ls

ENV NAME OtakuQuotes

EXPOSE 3000

ENTRYPOINT cd /opt/app && npm start localhost