FROM node:18

WORKDIR /app/results_engine

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

CMD ["node", "results_engine/results_engine.js"]
