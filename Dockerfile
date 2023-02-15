FROM node:19-alpine3.16

# Create app directory
WORKDIR /app

# Prepare to install dependencies
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci

# Prepare to build the project
COPY . .

EXPOSE 4000
ENTRYPOINT ["npm", "run"]
CMD ["start"]
