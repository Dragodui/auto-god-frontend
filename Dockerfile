FROM node:20

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install with npm
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]