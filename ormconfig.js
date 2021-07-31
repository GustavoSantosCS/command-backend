require('dotenv').config();

module.exports = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  extra: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false,
  entities: ['./src/data/entities/**.*'],
  migrations: ['./src/infra/db/typeorm/migrations/**.*'],
  cli: {
    migrationsDir: './src/infra/db/typeorm/migrations'
  }
};
