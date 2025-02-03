import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/**
 * 🚨 WARNING: This function will completely wipe the `trades` and `ai_advice` tables.
 */
const wipeDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log("⚠️ Wiping all trades and AI advice from the database...");

    // Delete all rows from both tables
    await client.query("DELETE FROM trades;");
    await client.query("DELETE FROM ai_advice;");

    // Reset the ID counter (for SERIAL primary key) on both tables
    await client.query("ALTER SEQUENCE trades_id_seq RESTART WITH 1;");
    await client.query("ALTER SEQUENCE ai_advice_id_seq RESTART WITH 1;");

    console.log("✅ Database wiped successfully! All trade data and AI advice have been deleted.");

  } catch (err) {
    console.error("❌ Error wiping database:", err.message);
  } finally {
    client.release();
    process.exit(0); // Exit script after completion
  }
};

// Run the function when this file is executed
wipeDatabase();

//run
//node services/wipeDB.js
