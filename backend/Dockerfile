# Use the official Node.js image.
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 4000, but you might want to change the comment to 3001
EXPOSE 3001

CMD ["node", "index.js"]
