FROM node:18

WORKDIR /app/betting_api

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

CMD ["node", "betting_api/betting_api.js"]
