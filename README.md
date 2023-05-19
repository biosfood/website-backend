# Website-backend

This is the graphql-based backend for my personal website.

It uses the Apollo graphql server and a sequelize powered sqlite database.

## Before starting

Change JWT_SECRET in .env before starting. This is the secrect key to authenticate a JSON-web-token and remember logged in users.

## Running

To start the backend server, run

```bash
npm run start
```

After compiling the typescript source code, the web server will start and be available at `localhost:4000/graphql`.
