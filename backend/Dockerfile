# Use Node.js 22
FROM node:22

# Create working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the project
COPY . .

# Expose your backend port
EXPOSE 3000

# Run the backend
CMD ["npm", "run", "dev"]