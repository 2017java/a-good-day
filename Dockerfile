FROM node:20-alpine
WORKDIR /app
COPY app/package*.json ./
RUN npm ci
COPY app/ .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
