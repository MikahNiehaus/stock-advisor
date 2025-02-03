import pkg from "pg"; 
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Remove `ai_advice` column from `trades` table if it exists
const removeAiAdviceColumnQuery = `ALTER TABLE trades DROP COLUMN IF EXISTS ai_advice;`;

// ✅ Create `trades` table (without `ai_advice` column)
const createTradesTableQuery = `
  CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    politician TEXT NOT NULL,
    stock TEXT NOT NULL,
    transaction TEXT NOT NULL,
    trade_date DATE NOT NULL,
    data_fetched_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log("🚀 Connecting to the database...");

    // ✅ Remove `ai_advice` column from the `trades` table if it exists
    console.log("⚠️ Removing `ai_advice` column from `trades` table...");
    await client.query(removeAiAdviceColumnQuery);

    // ✅ Create tables
    console.log("📋 Creating `trades` table...");
    await client.query(createTradesTableQuery);
    console.log("✅ Tables created successfully!");

  } catch (err) {
    console.error("❌ Error setting up database:", err.message);
  } finally {
    client.release();
    process.exit(0);
  }
};

// ✅ Run the function
initializeDatabase();
