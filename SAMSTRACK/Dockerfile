FROM node:18
MAINTAINER Shubham Ghongade <shubhamghongade199@gmail.com>

EXPOSE 4200
WORKDIR /app

# Copy only package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Install Angular CLI globally
RUN npm install -g @angular/cli

CMD ["ng", "serve", "--host=0.0.0.0", "--port=4200"]

