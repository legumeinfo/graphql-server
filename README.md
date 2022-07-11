# Legumeinfo GraphQL Server
This repository contains a GraphQL server made with the [Apollo Server](https://www.apollographql.com/docs/apollo-server) that consumes data from one or more InterMine servers.


## Docker
You setup and run the Legumeinfo GraphQL Server with Docker as follows:

### Setup
Use the following command to build the Docker image:
```console
docker build . -t legumeinfo-graphql-server
```

### Running
Once the Docker image is build, use the following command to start a container:
```console
docker run -p 4000:4000 legumeinfo-graphql-server
```
Then navigate your browser to [http://localhost:4000](http://localhost:4000) to query the server with the [Apollo Explorer](https://www.apollographql.com/docs/studio/explorer/explorer/).


## Local
You setup and run the Legumeinfo GraphQL Server without Docker as follows:

### Setup
Use the following command to install server's dependencies:
```console
npm install
```

### Running
Once the dependencies are installed, use the following command to start the server:
```console
node src/index.js
```
Then navigate your browser to [http://localhost:4000](http://localhost:4000) to query the server with the [Apollo Explorer](https://www.apollographql.com/docs/studio/explorer/explorer/).
