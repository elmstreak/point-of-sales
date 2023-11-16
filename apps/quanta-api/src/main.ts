/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { ProductRoutes } from './routes/products/products.main';
import cors from 'cors';
import * as bodyParser from 'body-parser';

const app = express();

// SETUP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ROUTES
app.use('/', ProductRoutes);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
