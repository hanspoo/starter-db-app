# Nx react+express plus typeorm, antd and storybook

This is a project created with nx using react + express template.

## Structure

### flash

React application

### api

The express application

### components

Shared react components developed with storybook.

### dao

Typeorm data acces library

## Added value:

- typeorm
- storybook
- antd
- postgresql

## Modus operandi:

Develop react components in a library called components.
Components are developed using storybook. Storybook is configured with a proxy to allow the components to access de /api and be autonomus.
Once ready the components, use them in the main react app flash.
To scale, encapsulate the routes for each table in a route component for each table, in this case users.

## TODO

I've not covered tests here.

## Init database

Create the database and user with the script: data-utils/pg-create.sh, that must be called like this:

```
pg-create.sh flash flash flash
```

Then, start the project and the orm to create the tables.

```
nx serve api
```

Running the tests will not work because in tests environments it uses sqlite, and we want the
dev env, that uses postgresql.

Finally this create the first client with its bussines units:

```
psql -h localhost -U flash < data-utils/crea-cliente.sql
```

## UUID

En postgresql ejecutar:

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
