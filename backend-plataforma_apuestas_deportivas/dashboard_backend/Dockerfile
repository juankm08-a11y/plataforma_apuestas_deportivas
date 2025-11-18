FROM node:18

WORKDIR /app/dashboard_backend

COPY package.json package-lock.json ./
RUN npm install 

COPY . .

CMD ["node", "dashboard_backend/dashboard_backend.js"]
