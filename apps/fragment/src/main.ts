/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import * as db from './db-connect';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', async (req, res) => {
  try {
    const result = await db.getProducts();
    res.json(result['rows']);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to fragment!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
