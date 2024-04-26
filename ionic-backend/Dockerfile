FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=826

EXPOSE $PORT

CMD ["node", "app.js"]