FROM node:19-alpine3.16 as base

# Create app directory
WORKDIR /usr/src/app

# Prepare to install dependencies
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci

# Prepare to build the project
COPY . .


# dev image
FROM base as dev

EXPOSE 4000
CMD ["npm", "run", "serve:dev"]


# TODO: production image
