import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// This file connects the backend to PostgreSQL.
// I put it in its own file so every route can reuse the same database connection.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
