# Express PostgreSQL API

## An Express API that uses PostgreSQL as a database.

Clone the project, install dependencies with `npm install` or `yarn add` and start contributing.

There is a config file for postgres. You can create one and test the code against your local database. It has the following format:

```javascript
const Pool = require("pg").Pool

const pool = new Pool({
    user: POSTGRES USER, // name of the role you use for your database
    host: HOST, // localhost or IP like 9.9.9.9
    database: DATABASE NAME,
    password: PASSWORD, // password for the role/user
    port: PORT, // default is 5432 for PostgreSQL
})

module.exports = {
    pool
}
```