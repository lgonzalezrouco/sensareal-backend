FROM node:hydrogen-alpine

# Change working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Setup the server
RUN make setup

# Start the application
CMD ["make", "dev"]
