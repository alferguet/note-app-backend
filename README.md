# Note App Backend

## Description

Simple note app to showcase NestJS skills.

## Installation

```bash
npm install
echo 'DB_USERNAME=postgres\nDB_PASSWORD=djkJFS2374@jdk\nDB_HOST=notes-database\nDB_PORT=5432' > .env.production
echo 'DB_USERNAME=postgres\nDB_PASSWORD=djkJFS2374@jdk\nDB_HOST=localhost\nDB_PORT=5432' > .env.development
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

```bash
docker-compose --env-file .env.production up -d --build
```

*Once deployed access [OpenAPI Docs](localhost:3000/api-docs) for API Rest documentation.*

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Author

- [Alejandro Fernandez Huguet](https://github.com/alferguet)

## License

Note App Backend is [GPL-3.0 licensed](LICENSE).
