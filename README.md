# Application README

## Setup Instructions - Localhost:

1. Clone the repository.
2. Run `npm i` to install all dependencies.
3. Run `npx tsc` to compile typeScript.
4. Run `npm start` to start the server.
5. Access the API's at [http://localhost:3000](http://localhost:3000).

## Setup Instructions - Docker:

1. Clone the repository.
2. Run `npm i` to install all dependencies.
3. Run `docker-compose up` to start the application.
4. Access the API's at [http://localhost:3000](http://localhost:3000).

## Known Issues:

- Limited scalability due to in-memory storage.
- No persistent data storage.
