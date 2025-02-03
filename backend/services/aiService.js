import { storeAiAdvice, getAllAiAdvice } from "./dbService.js"; // Import AI DB functions
import { getStockAdvice } from "./aiAdviceGenerator.js"; // AI logic file
import pool from "./dbService.js"; // Import database connection

/**
 * ✅ Check if AI advice is needed and generate it if necessary.
 */
export async function generateAiAdviceIfNeeded(trades) {
  const client = await pool.connect();
  try {
    const today = new Date().toISOString().split("T")[0];

    // ✅ Check if AI advice already exists for today
    const result = await client.query("SELECT * FROM ai_advice WHERE generated_date = $1", [today]);
    if (result.rows.length > 0) {
      console.log("🧠 AI advice already generated today. Using stored advice.");
      return result.rows[0].advice; // ✅ Return existing AI advice
    }

    // ✅ If no AI advice exists, generate new one
    console.log("🧠 Generating AI advice...");
    const newAdvice = await getStockAdvice(trades);
    await storeAiAdvice(newAdvice); // ✅ Save new AI advice

    return newAdvice;
  } catch (error) {
    console.error("❌ Error fetching AI advice:", error.message);
    return "AI advice unavailable.";
  } finally {
    client.release();
  }
}
