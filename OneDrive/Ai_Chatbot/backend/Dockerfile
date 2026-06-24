FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy app
COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
