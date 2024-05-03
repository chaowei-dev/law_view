# Use the official Node.js 20 image
FROM node:20

# Create and set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port 3001
EXPOSE 3001

# Command to run the app
CMD ["node", "index.js"]
