/* eslint-disable no-param-reassign */
import { v4 as uuid } from 'uuid';
import multer, { StorageEngine } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import { HttpRequest } from '@/presentation/protocols';
import { env } from '@/main/config/env';

type Config = {
  target: string;
  resultObjectName: string;
  errorMessage: string;
  destination: string;
};

export const adapterMulter =
  (fieldLabel: string, configPersister: Config) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers
    };

    const nameHandler = (originName: string) =>
      `${uuid()}-${originName}`.split(' ').join('_');

    const config: { local: StorageEngine; s3: StorageEngine } = {
      local: multer.diskStorage({
        destination: configPersister.destination,
        filename(_, file, callback) {
          const fileName = nameHandler(file.originalname);
          (file as any).key = fileName;

          (
            file as any
          ).location = `${env.app.protocol}://${env.app.host}:${env.app.port}/files/${configPersister.target}/${fileName}`;

          callback(null, fileName);
        }
      }),
      s3: multerS3({
        s3: new aws.S3(),

        bucket: `${env.storage.bucket.name}/${configPersister.target}`,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (_, file, callback) => {
          const fileName = nameHandler(file.originalname);

          callback(null, fileName);
        }
      })
    };

    const update = multer({
      dest: configPersister.destination,
      storage: config[env.storage.type],
      limits: {
        fileSize: 2 * 1024 * 1024
      },
      fileFilter: (_, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png'];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(configPersister.errorMessage));
        }
      }
    }).single(fieldLabel);

    return update(req, res, error => {
      if (error || !req.file) {
        console.error(error);
        return res.status(500).json({
          errors: [{ message: configPersister.errorMessage }]
        });
      }
      const { originalname, key, location } = req.file as any;
      httpRequest.body[configPersister.resultObjectName] = {
        originalName: originalname,
        persistentName: key,
        target: location
      };
      Object.assign(req.body, httpRequest.body);

      next();
    });
  };
