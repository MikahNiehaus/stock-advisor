import express from "express";
import { fetchTradesForAllPoliticians } from "./services/scraperService.js";
import { getAllTrades, getAllAiAdvice } from "./services/dbService.js";

const router = express.Router();

/**
 * ✅ API: Fetch all politician trades (from DB or scrape if needed).
 */
router.get("/api/all-politician-trades", async (req, res) => {
  try {
    console.log("🔍 Checking if scraping is needed...");
    const { trades, aiAdvice } = await fetchTradesForAllPoliticians();

    res.json({
      status: "success",
      message: "Fetched all politicians' trades successfully.",
      aiAdvice,
    });
  } catch (error) {
    console.error("❌ Error fetching trades:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch trades.",
      trades: [],
    });
  }
});

/**
 * ✅ API: Fetch stored trades from database.
 */
router.get("/api/politician-trades", async (req, res) => {
  const trades = await getAllTrades();
  res.json({ status: "success", trades });
});

/**
 * ✅ API: Fetch the latest AI advice.
 */
router.get("/api/all-ai-advice", async (req, res) => {
  const aiAdvice = await getAllAiAdvice();
  res.json({ status: "success", aiAdvice });
});

export default router;
