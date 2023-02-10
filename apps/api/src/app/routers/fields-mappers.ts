import { dataSource, FieldsMapper } from '@flash-ws/db';
import * as express from 'express';
import { Request, Response } from 'express';

const fieldsMappers = express.Router();
fieldsMappers.get('/', async function (req: Request, res: Response) {
  const fieldsMappers = await dataSource
    .getRepository(FieldsMapper)
    .find({ relations: ['campos'], where: { empresa: req['empresa'] } });
  res.json(fieldsMappers);
});

fieldsMappers.get('/:id', async function (req: Request, res: Response) {
  const results = await dataSource.getRepository(FieldsMapper).findOneBy({
    id: req.params.id as unknown as number,
  });
  return res.send(results);
});

export { fieldsMappers };
