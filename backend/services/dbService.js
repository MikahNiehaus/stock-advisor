import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ Export `pool` so it can be used in `aiService.js`
export default pool;

/**
 * ✅ Check if today's trade data exists and if AI advice needs to be refreshed.
 */
export async function checkIfDataChanged(trades, politician) {
  const client = await pool.connect();
  try {
    const today = new Date().toISOString().split("T")[0];

    // Check if trades already exist for today
    const result = await client.query(
      "SELECT * FROM trades WHERE politician = $1 AND data_fetched_date = $2 ORDER BY trade_date DESC",
      [politician, today]
    );

    // If trades exist, return stored data
    if (result.rows.length > 0) {
      console.log(`⏳ Trades for ${politician} already exist today. Using stored data.`);
      return { isNewData: false, storedTrades: result.rows, refreshAI: true };
    }

    // Check if any trades exist for this politician
    const previousTrades = await client.query(
      "SELECT stock, transaction, trade_date FROM trades WHERE politician = $1 ORDER BY trade_date DESC",
      [politician]
    );

    if (previousTrades.rows.length === 0) {
      console.log(`⚠️ No trades found for ${politician}. DB needs repopulation.`);
      return { isNewData: true, storedTrades: [], refreshAI: true };
    }

    // Identify new trades
    const newTrades = trades.filter(
      (trade) =>
        !previousTrades.rows.some(
          (existing) =>
            existing.stock === trade.stock &&
            existing.transaction === trade.transaction &&
            existing.trade_date.toISOString().split("T")[0] === trade.trade_date
        )
    );

    return { isNewData: newTrades.length > 0, newTrades, refreshAI: true };
  } finally {
    client.release();
  }
}

/**
 * ✅ Get all stored trades.
 */
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

/**
 * ✅ Store new trades in the database.
 */
export async function storeTradesInDB(trades) {
  const client = await pool.connect();
  try {
    for (const { politician, trades: tradeList } of trades) {
      for (const trade of tradeList) {
        const query = `
          INSERT INTO trades (politician, stock, transaction, trade_date, data_fetched_date)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (politician, stock, transaction, trade_date) 
          DO NOTHING;
        `;
        await client.query(query, [
          politician,
          trade.stock,
          trade.transaction,
          trade.trade_date,
          new Date().toISOString().split("T")[0],
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

/**
 * ✅ Store AI advice separately.
 */
export async function storeAiAdvice(advice) {
    const client = await pool.connect();
    try {
      const today = new Date().toISOString().split("T")[0];
  
      const query = `
        INSERT INTO ai_advice (advice, generated_date)
        VALUES ($1, $2)
      `;
      await client.query(query, [advice, today]);
  
      console.log(`✅ AI advice stored for ${today}: "${advice}"`);
    } catch (err) {
      console.error("❌ Error storing AI advice:", err.message);
    } finally {
      client.release();
    }
  }
  

/**
 * ✅ Get today's stored trades.
 */
export async function getTodaysTrades(politician) {
  const client = await pool.connect();
  const today = new Date().toISOString().split("T")[0];

  try {
    const result = await client.query(
      "SELECT * FROM trades WHERE politician = $1 AND data_fetched_date = $2 ORDER BY trade_date DESC",
      [politician, today]
    );

    return result.rows;
  } catch (err) {
    console.error("❌ Error fetching today's trades:", err.message);
    return [];
  } finally {
    client.release();
  }
}

/**
 * ✅ Get the latest AI advice.
 */
export async function getAllAiAdvice() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT * FROM ai_advice ORDER BY generated_date DESC LIMIT 1");
    return result.rows.length > 0 ? result.rows[0].advice : "⚠️ No AI advice available.";
  } catch (err) {
    console.error("❌ Error fetching AI advice:", err.message);
    return "Error retrieving AI advice.";
  } finally {
    client.release();
  }
}


