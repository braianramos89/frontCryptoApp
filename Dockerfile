FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install && npm install dotenv

ARG REACT_APP_ENV
ENV REACT_APP_ENV=$REACT_APP_ENV

# Bundle app source
COPY . .

# Expose port and start the application
EXPOSE 3000
CMD ["sh", "-c", "node -r dotenv/config node_modules/.bin/react-scripts start"]