FROM node:19-alpine3.16

#needed for healthcheck
RUN apk --no-cache add curl

# Create app directory
WORKDIR /app

# Prepare to install dependencies
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci

# Prepare to build the project
COPY . .

# Build
RUN npm run build

# Check if the server is healthy
HEALTHCHECK CMD curl -f --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query { __typename }"}' || exit 1

# Run the server
EXPOSE 4000
ENTRYPOINT ["npm", "run"]
CMD ["serve:prod"]
