# Legumeinfo GraphQL Server
This repository contains a GraphQL server made with the [Apollo Server](https://www.apollographql.com/docs/apollo-server) that consumes data from one or more InterMine servers.


## Quick Start

Start a **non-production** instance of the GraphQL Server using Docker Compose as follows:
```console
docker compose -f compose.yml up -d
```
The server can be queried at [localhost:4000](http://localhost:4000).


## Running
The GraphQL Server can be run via Docker (Compose) or directly in your local environment.
The `PORT` environment variable can be used to change what port the server uses when running locally or with Docker Compose.
When using Docker, the port should be changed manually via the port mapping flag when running the container.
The port is `4000` by default.

When the server is running in developer mode, you can query it interactively using the [Apollo Explorer](https://www.apollographql.com/docs/studio/explorer/explorer/).
You can use the Apollo Explorer by navigating your browser to [http://localhost:4000](http://localhost:4000) (the port should be the same as the `PORT` environment variable).


### Docker
A Docker image can be built that contains the environment necessary to build and run the server.
The `entrypoint` for this image is the `npm run` command.
The default `command` for this `entrypoint` is the `start` script defined in `package.json`, which simply compiles and runs the code in neither development or production mode.
**The default `command` should not be used for production.**
Override the `command` to compile and run the code in a specific environment or to run another command from `package.json`; see the Local instructions below for details on commands for development and production.

In general, we recommend using Docker Compose instead of Docker because it provides the configurations necessary to run the server in development or production mode.
See Docker Compose below for details.

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


### Docker Compose
Three Docker Compose files are provided for running the GraphQL Server: `compose.yml`, `compose.dev.yml`, and `compose.prod.yml`.
Running each file will automatically build the Docker image and configure it for a particular environment.

#### `compose.yml`
This file contains a base configuration that the `compose.dev.yml` and compose.prod.yml` files extend.
Running it alone will compile and run the code in neither development or production mode, as previously described:
```console
docker compose -f compose.yml up -d
```

#### `compose.dev.yml`
This file runs the Docker image in development mode, which will automatically rebuild the code and restart the server whenever a change is made.
Note that container health checks are disabled since the server is expected to break during development.
Additionally, the code directories on the host machine are mounted as volumes in the container so that the code can be edited on the host.
```console
docker compose -f compose.yml -f compose.dev.yml up
```
This command does not run the container as a daemon so that compiler errors and debug messages will be printed in the host console in real time.

#### `compose.prod.yml`
**This is the file to use when running the server in production.**
This file runs the Docker image in production mode, which disables GraphQL introspection and limits logging to errors only.
```console
docker compose -f compose.yml -f compose.prod.yml up -d
```


### Local
The following instructions describe how to setup your local environment for running the server in both development and production mode.
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


### `.env` file
A `.env` file is included in the repository.
This file is used to set environment variables that control the server AND Docker Compose.
For instance, when running the server directly with npm in your local environment the server will load environment variables from the `.env` file, such as the `PORT` variable.
However, the `.env` file is not included in the Docker image when it's built and it is explicitly excluded from the mounted volumes in the `compose.dev.yml` file.
This is to ensure that the environment inside the Docker <u>image</u> is always the same and that environment variables inside a <u>container</u> are set in a canonical way, i.e. via Docker (Compose).
Continuing the `PORT` example, this means when using Docker Compose the server inside the container will run on the default port - `4000` - but the `compose.yml` file will use the `PORT` environment variable to determine which port on the host to map the container's port to.
In other words, using the `.env` file to set environment variables will have the same *effect*, but *how* the effect is achieved depends on whether the server is being run locally or with Docker Compose.
