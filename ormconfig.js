require('dotenv').config();

const extensionFile = process.env.NODE_ENV === 'development' ? 'ts' : 'js';

const config = {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [`./dist/data/entities/**.${extensionFile}`],
  migrations: [`./dist/infra/db/typeorm/migrations/**.${extensionFile}`],
  cli: {
    migrationsDir: './dist/infra/db/typeorm/migrations'
  }
};

if (process.env.DB_ENV === 'production') {
  config.extra = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

module.exports = config;
