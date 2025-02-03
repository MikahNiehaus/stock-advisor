import pkg from "pg"; 
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Drop `ai_advice` table if it exists
const dropAiAdviceTableQuery = `DROP TABLE IF EXISTS ai_advice;`;

// ✅ Create `trades` table
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

// ✅ Create `ai_advice` table (WITHOUT politician column)
const createAiAdviceTableQuery = `
  CREATE TABLE IF NOT EXISTS ai_advice (
    id SERIAL PRIMARY KEY,
    advice TEXT NOT NULL,
    generated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log("🚀 Connecting to the database...");

    // ✅ Drop AI Advice table first to ensure old structure is removed
    console.log("⚠️ Dropping existing `ai_advice` table...");
    await client.query(dropAiAdviceTableQuery);

    // ✅ Create tables
    console.log("📋 Creating `trades` and `ai_advice` tables...");
    await client.query(createTradesTableQuery);
    await client.query(createAiAdviceTableQuery);
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
