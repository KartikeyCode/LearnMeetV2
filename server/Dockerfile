# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
# The wildcard ensures both files are copied
COPY package*.json ./

# Install app dependencies using 'npm ci' for a clean, reproducible install
RUN npm ci

# Copy the rest of your application's source code
COPY . .

# Make port 2567 available to the world outside this container
EXPOSE 2567

# Define the command to run your app
CMD [ "npm", "start" ]
