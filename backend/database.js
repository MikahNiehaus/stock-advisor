import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool; // ✅ Export the database connection

// ✅ Fetch all stored trades
export async function getAllTrades() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM trades ORDER BY trade_date DESC");
    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching trades:", err.message);
    return [];
  } finally {
    client.release();
  }
}

// ✅ Store new trades in the database
export async function storeTradesInDB(trades) {
  const client = await pool.connect();
  try {
    for (const { politician, trades: tradeList } of trades) {
      for (const trade of tradeList) {
        const query = `
          INSERT INTO trades (politician, stock, transaction, trade_date)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (politician, stock, transaction, trade_date) 
          DO NOTHING;
        `;
        await client.query(query, [
          politician,
          trade.stock,
          trade.transaction,
          trade.trade_date,
        ]);
      }
    }
    console.log("✅ New trades inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting trades:", err.message);
  } finally {
    client.release();
  }
}
