import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Railway
});

// ✅ Function to check if today's data exists
export async function checkTodaysData(politician) {
    const today = new Date().toISOString().split('T')[0];

    try {
        const res = await pool.query(
            'SELECT * FROM trades WHERE politician = $1 AND date = $2',
            [politician, today]
        );
        return res.rows.length > 0 ? res.rows : null;
    } catch (err) {
        console.error('❌ Database query failed:', err);
        return null;
    }
}

// ✅ Function to save scraped data
export async function saveTrades(politician, trades, aiAdvice) {
    try {
        const query = `
            INSERT INTO trades (politician, stock, transaction, date, ai_advice)
            VALUES ($1, $2, $3, $4, $5)
        `;

        for (let trade of trades) {
            await pool.query(query, [
                politician,
                trade.stock,
                trade.transaction,
                trade.date,
                aiAdvice
            ]);
        }

        console.log(`✅ Trades saved for ${politician}`);
    } catch (err) {
        console.error('❌ Failed to insert trades:', err);
    }
}
