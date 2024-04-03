FROM node:16

ENV PORT=8080

WORKDIR /app

EXPOSE $PORT

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]