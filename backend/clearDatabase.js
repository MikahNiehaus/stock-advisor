import pkg from 'pg'; // Use CommonJS compatibility import for pg
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const { Pool } = pkg;

// Create a new PostgreSQL pool using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }, // Disable SSL for local development
});

// Function to clear all data from the `trades` table
const clearTable = async () => {
  const clearTableQuery = `
    DELETE FROM trades;
  `;
  try {
    console.log('🚀 Connecting to the database...');
    const client = await pool.connect(); // Connect to the database

    console.log('🧹 Clearing `trades` table...');
    const result = await client.query(clearTableQuery); // Execute the DELETE query
    console.log(`✅ Cleared ${result.rowCount} rows from the table!`);

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('❌ Error clearing table:', err.message || err);
  } finally {
    process.exit(0); // Exit the script (0 = success, 1 = failure)
  }
};

// Execute the function
clearTable();
