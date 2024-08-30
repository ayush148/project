# Use an official Node.js image as a base image
FROM node:18-alpine

# Install dependencies required for bcrypt and other native modules
RUN apk add --no-cache make gcc g++ python3

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install dotenv explicitly
RUN npm install dotenv

# Copy the rest of the application code to the working directory
COPY . .
COPY .env ./

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]