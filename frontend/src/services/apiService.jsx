const LOCAL_BACKEND = "http://localhost:8080"; // ✅ Local backend for development
const PRODUCTION_BACKEND = "https://stock-advisor-production.up.railway.app";

// ✅ Automatically select backend based on environment
const backendUrl =
  process.env.NODE_ENV === "development" ? LOCAL_BACKEND : PRODUCTION_BACKEND;

// ✅ Fetch stock trades from backend
export async function fetchStockTrades() {
  try {
    console.log(`🔍 Fetching stock trades from: ${backendUrl}/api/politician-trades`);
    const response = await fetch(`${backendUrl}/api/politician-trades`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      console.warn("⚠️ Backend error:", data.message);
      return [];
    }

    console.log("✅ Stock trades received:", data.trades);
    return data.trades || [];
  } catch (error) {
    console.warn(`⚠️ Failed to fetch from: ${backendUrl}`, error.message);
    return []; // Return an empty array to avoid frontend crashes
  }
}

// ✅ Fetch AI stock advice (NEW ENDPOINT)
export async function fetchAiAdvice() {
  try {
    console.log(`🔍 Fetching AI stock advice from: ${backendUrl}/api/all-ai-advice`);
    const response = await fetch(`${backendUrl}/api/all-ai-advice`);
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.status === "error") {
      console.warn("⚠️ Backend error:", data.message);
      return "⚠️ No AI advice available.";
    }

    console.log("✅ AI Advice received:", data.advice);
    
    // ✅ Get only the most recent AI advice
    const latestAdvice = data.advice.length > 0 ? data.advice[0].advice : "⚠️ No AI advice available.";
    return latestAdvice;
  } catch (error) {
    console.warn(`⚠️ Failed to fetch AI advice from: ${backendUrl}`, error.message);
    return "❌ Unable to fetch AI stock advice.";
  }
}
