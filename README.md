# Legumeinfo GraphQL Server
This repository contains a GraphQL server made with the [Apollo Server](https://www.apollographql.com/docs/apollo-server) that consumes data from one or more InterMine servers.

## GraphQL schema
This version uses a GraphQL schema which is tightly based on the InterMine data model.

## Running
The GraphQL Server can be run via Docker or directly in your local environment.
In both cases, the `PORT` environment variable can be used to change what port the server uses; the port is `4000` by default.

When the server is running in developer mode, you can query it interactively using the [Apollo Explorer](https://www.apollographql.com/docs/studio/explorer/explorer/).
You can use the Apollo Explorer by navigating your browser to [http://localhost:4000](http://localhost:4000) (the port should be the same as the `PORT` environment variable).

### Docker
A Docker image can be built that contains the environment necessary to build and run the server.
Currently this only runs the server in development mode.

#### Setup
Use the following command to build the Docker image:
```console
docker build . -t legumeinfo-graphql-server
```

### Running
Once the Docker image is built, use the following command to start a container:
```console
docker run -p 4000:4000 legumeinfo-graphql-server
```


### Local
The following instructions describe how to setup you local environment for running the server in both development and production mode.
See the `package.json` file for other commands.

#### Setup
The server's dependencies can be installed via [npm](https://www.npmjs.com/):
```console
npm install
```

#### Development mode
Once the dependencies are installed, use the following command to start the server in development mode:
```console
npm run serve:dev
```
This will automatically rebuild the code and restart the server whenever a change is made.


#### Production mode
To run the server in production mode, you must first build the code:
```console
npm run build
```
Once the code is built, the server can be run in production mode as follows:
```console
npm run serve:prod
```
As with development mode, this will start the server on port `4000` (or whatever the `PORT` environment variable is set to).
However, for security purposes [introspection](https://www.apollographql.com/blog/graphql/security/why-you-should-disable-graphql-introspection-in-production/) will be disabled, meaning the Apollo Explorer will not be available.
