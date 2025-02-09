FROM node:18-alpine

WORKDIR /usr/src/app

COPY ./ ./

RUN chown -R node:node /usr/src/app

RUN npm install

USER node
EXPOSE 3000/tcp

CMD ["npm", "run", "server"]
