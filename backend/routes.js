import express from "express";
import { fetchTradesForAllPoliticians } from "./services/scraperService.js";
import { getAllTrades } from "./services/dbService.js";  // ✅ Ensure correct import
import { getAllAiAdvice } from "./services/dbService.js";

const router = express.Router();



// ✅ API: Fetch all AI advice
router.get("/api/all-ai-advice", async (req, res) => {
    try {
      const advice = await getAllAiAdvice();
      res.json({ status: "success", advice });
    } catch (error) {
      console.error("❌ Error fetching AI advice:", error.message);
      res.status(500).json({
        status: "error",
        message: "Failed to fetch AI advice.",
        advice: [],
      });
    }
  });

// ✅ API: Fetch all politicians' trades (scrape if needed, otherwise return stored)
router.get("/api/all-politician-trades", async (req, res) => {
  try {
    console.log("🔍 Checking if scraping is needed...");
    const trades = await fetchTradesForAllPoliticians();

    res.json({
      status: "success",
      message: "Fetched all politicians' trades successfully.",
      trades,
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

// ✅ API: Fetch stored trades from the database
router.get("/api/politician-trades", async (req, res) => {
  try {
    const trades = await getAllTrades();
    res.json({ status: "success", trades });
  } catch (error) {
    console.error("❌ Error fetching trades from database:", error.message);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch trades.",
      trades: [],
    });
  }
});

export default router;
