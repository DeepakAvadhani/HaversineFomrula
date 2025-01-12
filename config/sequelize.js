const { Sequelize } = require("sequelize");
const config = require("./config.json")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
  }
);

(async () => {
  try {
    const sequelizeForDB = new Sequelize(
      null,
      config.username,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
      }
    );

    await sequelizeForDB.query(
      `SELECT 1 FROM pg_database WHERE datname = '${config.database}';`
    );
    await sequelizeForDB
      .query(
        `CREATE DATABASE "${config.database}" WITH OWNER = "${config.username}" ENCODING = 'UTF8';`
      )
      .catch(() =>
        console.log(`Database "${config.database}" already exists.`)
      );
    await sequelizeForDB.close();

    await sequelize.authenticate();
    console.log("Connected to the PostgreSQL database successfully.");

    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error setting up database or syncing models:", error);
  }
})();

module.exports = sequelize;