# Use Node.js 22
FROM node:22

# Create a working directory inside the container
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Set build arguments and environment variables
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_URL

ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL

# Expose Vite's port
EXPOSE 5173

# Start the development server
CMD ["npm", "run", "dev", "--", "--host"]