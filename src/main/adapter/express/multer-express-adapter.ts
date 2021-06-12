import { v4 as uuid } from 'uuid';
import multer, { Options } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { env } from '@/main/config/env';

export const adapterMulter =
  (fieldLabel: string, target: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const config = {
      storage: multer.diskStorage({
        destination: env.multer.destinationRoot.disc,
        filename(_, file, callback) {
          const fileName = `${uuid()}-${file.originalname}`;
          req.body.avatar = {
            ...file,
            persistentName: fileName,
            target: `${target}/${fileName}`
          };
          callback(null, fileName);
        }
      })
    } as Options;
    const multerHandler = multer(config).single(fieldLabel);

    return multerHandler(req, res, next);
  };
