require('dotenv').config();

const config = [
  {
    name: 'default',
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'docker',
    password: 'docker',
    database: 'docker',
    synchronize: false,
    logging: true,
    entities: ['./dist/data/entities/**.*'],
    migrations: ['./dist/infra/db/typeorm/migrations/**.*'],
    cli: {
      migrationsDir: './src/infra/db/typeorm/migrations'
    }
  },
  {
    name: 'production',
    type: process.env.DB_CONNECTION,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: false,
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    entities: ['./dist/data/entities/**.*'],
    migrations: ['./dist/infra/db/typeorm/migrations/**.*'],
    cli: {
      migrationsDir: './dist/infra/db/typeorm/migrations'
    }
  },
  {
    name: 'test',
    type: 'sqlite',
    database: './tmp/command/database.sqlite',
    synchronize: false,
    dropSchema: false,
    logging: true,
    entities: ['./src/data/entities/**.*'],
    migrations: ['./src/infra/db/typeorm/migrations/**.*'],
    cli: {
      migrationsDir: './src/infra/db/typeorm/migrations'
    }
  }
];

module.exports = config;
