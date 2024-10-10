FROM oven/bun:1.1-alpine

# Create app directory
WORKDIR /app

# Prepare to install dependencies
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN bun install --frozen-lockfile # equivalent to npm ci

# Prepare to build the project
COPY . .

# Build
RUN bun run build

# Check if the server is healthy
HEALTHCHECK CMD curl -f --request POST \
  --header 'content-type: application/json' \
  --url http://localhost:4000/ \
  --data '{"query":"query { __typename }"}' || exit 1

# Run the server
EXPOSE 4000
ENTRYPOINT ["bun", "run"]
CMD ["serve:prod"]
