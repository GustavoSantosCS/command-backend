import { v4 as uuid } from 'uuid';
import multer, { Options } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { env } from '@/main/config/env';
import { HttpRequest } from '@/presentation/protocols';

export const adapterMulter =
  (fieldLabel: string, target: string) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers
    };
    const config = {
      storage: multer.diskStorage({
        destination: env.multer.destinationRoot.disc,
        filename(_, file, callback) {
          const fileName = `${uuid()}-${file.originalname}`;
          const avatar = {
            originalName: file.originalname,
            persistentName: fileName,
            target: `${target}${fileName}`
          };
          httpRequest.body.avatar = avatar;
          callback(null, fileName);
        }
      })
    } as Options;
    const multerHandler = multer(config).single(fieldLabel);

    // eslint-disable-next-line consistent-return
    return multerHandler(req, res, error => {
      if (error) {
        return res.status(500).json({
          errors: [
            {
              message: 'Não foi possível salvar seu avatar'
            }
          ]
        });
      }
      Object.assign(req.body, httpRequest.body);
      next();
    });
  };
