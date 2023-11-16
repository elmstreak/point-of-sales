import express, { Request, Response } from 'express';
import fs from 'fs';

const ProductRoutes = express();

ProductRoutes.post('/product/update', (req: Request, res: Response) => {
  if (req.body) {
    const payload = JSON.stringify(req.body);

    fs.writeFile('db.json', JSON.stringify(payload), (err) => {
      console.log(err);
    });

    res.json({ response: 'OK' });
  } else {
    res.json({ status: 'no payload' });
  }
});

ProductRoutes.get('/product/store', (req: Request, res: Response) => {
  fs.readFile('db.json', (err, data: any) => {
    if (data) {
      res.json({ data: JSON.parse(JSON.parse(data)) });
    } else {
      res.json({ error: 'no data from file' });
    }
  });
});

export { ProductRoutes };
