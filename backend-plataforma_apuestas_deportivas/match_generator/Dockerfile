FROM node:18

WORKDIR /app/match_generator

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .+

CMD ["node","match_generator.js"]