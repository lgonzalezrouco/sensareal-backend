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

# Wait for the database to be ready
COPY ./wait-for-db.sh .
RUN chmod +x wait-for-db.sh
ENTRYPOINT [ "./wait-for-db.sh" ]

# Start the application
CMD "npm run migrate && npm run db:seed && npm run start"
