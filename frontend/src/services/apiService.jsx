import { useState } from "react";

const LOCAL_BACKEND = "http://localhost:8080"; // ✅ Local backend for development
const PRODUCTION_BACKEND = "https://stock-advisor-production.up.railway.app";

// ✅ Automatically select backend based on environment
const backendUrl =
  process.env.NODE_ENV === "development" ? LOCAL_BACKEND : PRODUCTION_BACKEND;

// ✅ Fetch the most recent 100 stock trades from backend
export async function fetchStockTrades() {
  try {
    console.log(`🔍 Fetching stock trades from: ${backendUrl}/api/all-politician-trades`);
    const response = await fetch(`${backendUrl}/api/all-politician-trades`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      console.warn("⚠️ Backend error:", data.message);
      return []; // Return empty array on error
    }

    console.log("✅ Stock trades received:", data.trades);
    return data.trades.slice(0, 100) || []; // ✅ Return only the most recent 100 trades
  } catch (error) {
    console.warn(`⚠️ Failed to fetch from: ${backendUrl}`, error.message);
    return []; // Return an empty array to avoid frontend crashes
  }
}

// ✅ Fetch AI stock advice
export async function fetchAiAdvice() {
  try {
    console.log(`🔍 Fetching AI stock advice from previous endpoint: ${backendUrl}/api/ai-advice`);
    const response = await fetch(`${backendUrl}/api/ai-advice`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      console.warn("⚠️ Backend error:", data.message);
      return "⚠️ No AI advice available."; // Return default error message
    }

    console.log("✅ AI Advice received:", data.advice);
    const latestAdvice = data.advice.length > 0 ? data.advice[0].advice : "⚠️ No AI advice available.";
    return latestAdvice;
  } catch (error) {
    console.warn(`⚠️ Failed to fetch AI advice from: ${backendUrl}`, error.message);
    return "❌ Unable to fetch AI stock advice."; // Return default error message
  }
}

// ✅ Combined function to fetch both stock trades and AI advice
export async function fetchStockDataAndAiAdvice() {
  try {
    const [trades, aiAdvice] = await Promise.all([
      fetchStockTrades(),
      fetchAiAdvice(),
    ]);

    return { trades, aiAdvice };
  } catch (error) {
    console.warn("⚠️ Error in fetching combined data:", error.message);
    return { trades: [], aiAdvice: "❌ Unable to fetch AI stock advice." }; // Return fallback values
  }
}
