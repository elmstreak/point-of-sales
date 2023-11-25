/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from 'pg';

const pool = new Pool({
  user: 'fragment_admin',
  password: 'P@ssword182',
  host: 'localhost',
  port: 5432, // default Postgres port
  database: 'fragment_admin',
});

export const getProducts = () => {
  return pool.query('SELECT * FROM vendor.vendor_products');
};
