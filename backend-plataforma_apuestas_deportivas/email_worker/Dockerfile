FROM node:18

WORKDIR /app/email_worker

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

CMD ["node", "email_worker/email_worker.js"]
