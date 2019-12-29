# Zurcher Interiors Hours WebApp

#### Preview:

- Pending

### Stack

- [NextJS + Custom Express](https://github.com/zeit/next.js/)
- [Emotion CSS-in-JS](https://github.com/emotion-js/emotion)
- [Postgres](https://www.postgresql.org/)
- [Sequelize: PostgresSQL ORM](http://docs.sequelizejs.com/)
- [Passport for local authentication](http://passportjs.org/)
- [Redux](http://redux.js.org/)
- [Babel](https://babeljs.io/)
- [Ant Design](https://ant.design/)
- [yarn](https://yarnpkg.com/en/)

### Why is this useful? Why should I care?

- The UX and UI are garbage, that means everything you do after will be better!
- Client and server are written in JavaScript.
- This is a production ready codebase you can use to test a concept you have.
- [Server side rendering](https://zeit.co/blog/next2) has been made simple.

## Setup: Prerequisites

I use [Homebrew](https://brew.sh/) to manage dependencies on a new laptop... You're welcome to use something else.

- Install Postgres: `brew install postgres`.
- Install [Node 10.7.0+](https://nodejs.org/en/): `brew install node`. (Or update your node)

## Setup: Quick newbies guide to Postgres

- On OSX, to run Postgres in a tab on the default port.

```sh
postgres -D /usr/local/var/postgres -p 5432
```

- Postgres config is stored in `./config.js`.
- Local database: `zurcherhours`.


### First time Postgres instructions.

```sh
# Enter Postgres console
psql postgres

# Create a new user for yourself
CREATE ROLE zurcherinteriors WITH LOGIN PASSWORD 'zurch3r';

# Allow yourself to create databases
ALTER ROLE zurcherinteriors CREATEDB;

# Exit Postgres console
\q

# Log in as your new user.
psql postgres -U zurcherinteriors

# Create a database named: zurcherhours.
# If you change this, update config.js
CREATE DATABASE zurcherhours;

# Give your self privileges
GRANT ALL PRIVILEGES ON DATABASE zurcherhours TO zurcherinteriors;

# List all of your databases
\list

# Connect to your newly created DB as a zurcherinteriors
\connect zurcherhours

# Exit Postgres console
\q
```

I also use a GUI called [TablePlus](https://tableplus.io/) if you don't like command line.

## Setup: Run locally

In the root directory run these commands:

```sh
yarn
yarn global add babel-cli
yarn global add sequelize-cli
sequelize db:migrate
sequelize db:seed:all
yarn run dev
```

Visit `localhost:8000` in a browser to start development locally. You will need postgres running.

## Deploy Heroku (Alternative choice)

To deploy with Heroku, please follow the instructions [here](https://github.com/jimmylee/next-postgres/blob/master/HEROKU.md).

There are very specific details you must pay attention to.

