import express from "express";
import { fetchAndUpdateDatabase } from "./services/scraperService.js";
import { getAllTrades } from "./services/dbService.js";
import { getStockAdvice } from "./services/aiAdviceGenerator.js";

const router = express.Router();

/**
 * ✅ API: Trigger Puppeteer to update the database.
 */
router.post("/api/update-database", async (req, res) => {
  try {
    console.log("🔍 Updating database...");
    const { trades } = await fetchAndUpdateDatabase();
    res.json({
      status: "success",
      message: "Database updated successfully!",
      newTrades: trades,
    });
  } catch (error) {
    console.error("❌ Error updating database:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to update database.",
    });
  }
});

/**
 * ✅ API: Fetch AI stock advice using **all** database data.
 */
router.get("/api/get-ai-advice", async (req, res) => {
  try {
    console.log("🔍 Fetching AI stock advice...");
    const trades = await getAllTrades();
    const aiAdvice = await getStockAdvice(trades); // ✅ AI always gets ALL data
    res.json({
      status: "success",
      aiAdvice,
    });
  } catch (error) {
    console.error("❌ Error fetching AI advice:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch AI advice.",
    });
  }
});

export default router;
