FROM node:hydrogen

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
RUN npm install
RUN npm run migrate
RUN npm run db:seed

# Start the application
CMD ["npm", "run", "start"]
