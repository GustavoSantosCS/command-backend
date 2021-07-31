import path from 'path';

const app = {
  env: process.env.NODE_ENV || 'development',
  key: process.env.APP_KEY || 'key app',
  protocol: process.env.APP_PROTOCOL || 'http',
  host: process.env.APP_HOST || 'localhost',
  port: process.env.PORT || 3333
};

const db = {
  connection: process.env.DB_CONNECTION || 'postgres',
  database: process.env.DB_DATABASE || 'docker',
  username: process.env.DB_USERNAME || 'docker',
  host: process.env.DB_HOST || 'docker',
  port: parseInt(process.env.DB_PORT) || 5433,
  password: process.env.DB_PASSWORD || 'docker'
};

const root = path.resolve(__dirname, '..', '..', '..', 'tmp', 'storage');
const storage = {
  type: process.env.STORAGE_TYPE || 'local',
  local: {
    avatar: `${root}/avatar`,
    establishment: `${root}/establishment`,
    product: `${root}/product`
  },
  bucket: {
    name: process.env.BUCKET_NAME,
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_DEFAULT_REGION
    }
  }
};

export const env = { app, db, storage };
