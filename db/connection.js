const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

const config = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
}

module.exports = new Pool(config);

// const pool = new Pool(config);

// pool.query("SELECT * FROM articles WHERE topic = 'cooking';", (err, res) => {
//   if (err) {
//     console.error("Error executing query", err.stack);
//   } else {
//     console.log("Query result:", res.rows);
//   }
//   pool.end();
// });
