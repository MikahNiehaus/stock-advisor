import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load OpenAI API Key from Environment Variables
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY is missing! Check Railway environment variables.");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Toggle AI Advice (Set to true/false)
const USE_AI_ADVICE = false; // ❌ Currently OFF (Uses hardcoded AI advice)

// ✅ Hardcoded Fallback Trade Data (Used when Scraping Fails)
const HARD_CODED_TRADES = [
  { stock: "Alphabet Inc\nGOOGL:US", transaction: "20 Jan\n2025", date: "14 Jan\n2025" },
  { stock: "Amazon.com Inc\nAMZN:US", transaction: "20 Jan\n2025", date: "14 Jan\n2025" },
  { stock: "Apple Inc\nAAPL:US", transaction: "20 Jan\n2025", date: "31 Dec\n2024" },
  { stock: "NVIDIA Corporation\nNVDA:US", transaction: "20 Jan\n2025", date: "31 Dec\n2024" },
  { stock: "NVIDIA Corporation\nNVDA:US", transaction: "20 Jan\n2025", date: "20 Dec\n2024" },
  { stock: "NVIDIA Corporation\nNVDA:US", transaction: "20 Jan\n2025", date: "14 Jan\n2025" },
  { stock: "Palo Alto Networks Inc\nPANW:US", transaction: "20 Jan\n2025", date: "20 Dec\n2024" },
  { stock: "TEMPUS AI INC\nTEM:US", transaction: "20 Jan\n2025", date: "14 Jan\n2025" },
  { stock: "Vistra Corp\nVST:US", transaction: "20 Jan\n2025", date: "14 Jan\n2025" },
  { stock: "REOF XXVI LLC\nN/A", transaction: "12 Sept\n2024", date: "13 Aug\n2024" },
  { stock: "Microsoft Corp\nMSFT:US", transaction: "31 Jul\n2024", date: "26 Jul\n2024" },
  { stock: "NVIDIA Corporation\nNVDA:US", transaction: "31 Jul\n2024", date: "26 Jul\n2024" },
  { stock: "Broadcom Inc\nAVGO:US", transaction: "3 Jul\n2024", date: "24 Jun\n2024" },
  { stock: "NVIDIA Corporation\nNVDA:US", transaction: "3 Jul\n2024", date: "26 Jun\n2024" },
  { stock: "Tesla Inc\nTSLA:US", transaction: "3 Jul\n2024", date: "24 Jun\n2024" }
];

// ✅ Hardcoded AI Advice (Used when AI is OFF)
const HARDCODED_AI_ADVICE = 
  "You should invest in NVIDIA Corporation (NVDA) because the repeated and recent trading activities suggest the anticipation of growth or leading technological advancements in their sectors such as AI and gaming hardware.\n\n" +
  "You should invest in Tesla Inc. (TSLA) because a continued trend in legislative trading suggests confidence in the company’s future growth.";

// ✅ Scrape Nancy Pelosi's Stock Trades from CapitolTrades
async function fetchPelosiTrades() {
  try {
    console.log(`🔍 Scraping stock trades for Nancy Pelosi...`);

    // ✅ Puppeteer Launch Fix for Railway
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/google-chrome-stable",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-software-rasterizer"
      ],
    });

    const page = await browser.newPage();

    // Spoof User-Agent to bypass bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    const url = `https://www.capitoltrades.com/politicians/P000197`;
    console.log(`🌐 Navigating to URL: ${url}`);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    console.log("✅ Page loaded, extracting trade data...");
    const trades = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("tbody tr"))
        .map((row) => {
          const columns = row.querySelectorAll("td");
          if (columns.length >= 3) {
            return {
              stock: columns[0].innerText.trim(),
              transaction: columns[1].innerText.trim(),
              date: columns[2].innerText.trim(),
            };
          }
          return null;
        })
        .filter((trade) => trade !== null);
    });

    await browser.close();

    if (trades.length === 0) {
      console.warn("⚠️ No trades found.");
      return { trades: HARD_CODED_TRADES, isFallback: true };
    }

    console.log(`📊 Extracted ${trades.length} trades.`);
    return { trades, isFallback: false };
  } catch (error) {
    console.error("❌ Failed to fetch Pelosi's trades:", error.message);
    return { trades: HARD_CODED_TRADES, isFallback: true };
  }
}

// ✅ AI-Powered Stock Investment Advice
async function getStockAdvice(trades) {
  try {
    if (!USE_AI_ADVICE) {
      console.log("⚠️ AI Advice is OFF. Returning hardcoded investment advice.");
      return HARDCODED_AI_ADVICE;
    }

    console.log("🤖 Sending trade data to OpenAI for AI investment recommendations...");
    
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert stock analyst specializing in political trading patterns. Based on Nancy Pelosi's trade data, provide decisive investment recommendations."
        },
        {
          role: "user",
          content: `Analyze these stock trades and provide concise investment recommendations. Here is the trade data: ${JSON.stringify(trades)}`
        }
      ],
      max_tokens: 50,
      temperature: 1.5
    });

    return aiResponse.choices[0]?.message?.content || "No AI advice provided.";
  } catch (error) {
    console.error("❌ Error generating stock advice:", error.message);
    return "Error generating AI advice.";
  }
}

// ✅ API to Get Nancy Pelosi's Stock Trades with AI Analysis
app.get("/politician-trades/nancy-pelosi/ai", async (req, res) => {
  console.log(`📊 Retrieving stock trades for Nancy Pelosi with AI analysis...`);
  
  try {
    const tradesData = await fetchPelosiTrades();
    const aiAdvice = await getStockAdvice(tradesData.trades);

    res.json({ 
      trades: tradesData.trades, 
      aiAdvice, 
      aiEnabled: USE_AI_ADVICE, 
      isFallback: tradesData.isFallback,
      message: USE_AI_ADVICE ? "✅ AI Advice is ON." : "⚠️ AI Advice is OFF. Using hardcoded investment advice."
    });
  } catch (error) {
    console.error("❌ Error retrieving Pelosi's trades:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ✅ Start Server (Use Dynamic Port for Railway)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
