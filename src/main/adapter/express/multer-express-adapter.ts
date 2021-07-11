import { v4 as uuid } from 'uuid';
import multer, { Options } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { env } from '@/main/config/env';
import { HttpRequest } from '@/presentation/protocols';

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
    const config = {
      storage: multer.diskStorage({
        destination: configPersister.destination,
        filename(_, file, callback) {
          const fileName = `${uuid()}-${file.originalname}`
            .split(' ')
            .join('_');

          httpRequest.body[configPersister.resultObjectName] = {
            originalName: file.originalname,
            persistentName: fileName,
            target: `${configPersister.target}/${fileName}`
          };
          callback(null, fileName);
        }
      })
    } as Options;
    const update = multer(config).single(fieldLabel);

    return update(req, res, error => {
      if (error) {
        return res.status(500).json({
          errors: [{ message: configPersister.errorMessage }]
        });
      }
      Object.assign(req.body, httpRequest.body);
      return next();
    });
  };
