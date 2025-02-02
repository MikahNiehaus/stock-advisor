import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());


// ✅ Load OpenAI API Key from environment variables (Same as Reference Code)
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY is missing!");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Scrape Nancy Pelosi's Stock Trades from CapitolTrades
async function fetchPelosiTrades() {
  try {
    console.log(`🔍 Scraping stock trades for Nancy Pelosi...`);
    
    const browser = await puppeteer.launch({ headless: "new" }); 
    const page = await browser.newPage();
    const url = `https://www.capitoltrades.com/politicians/P000197`;

    console.log(`🌐 Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });

    console.log("✅ Page loaded, extracting trade data...");
    const trades = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("tbody tr"))
        .map(row => {
          const columns = row.querySelectorAll("td");
          if (columns.length >= 3) {
            return {
              stock: columns[0].innerText.trim(),
              transaction: columns[1].innerText.trim(),
              date: columns[2].innerText.trim(),
            };
          }
          return null;
        }).filter(trade => trade !== null);
    });

    await browser.close();

    if (trades.length === 0) {
      console.warn("⚠️ No trades found.");
      return { error: "No recent trades available." };
    }

    console.log(`📊 Extracted ${trades.length} trades.`);
    
    return { trades };
  } catch (error) {
    console.error("❌ Failed to fetch Pelosi's trades:", error.message);
    return { error: "Failed to retrieve politician trades." };
  }
}

// ✅ AI-Powered Stock Investment Advice
async function getStockAdvice(trades) {
  try {
    console.log("🤖 Sending trade data to OpenAI for AI investment recommendations...");
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { 
            "role": "system", 
            "content": "You are an expert stock analyst specializing in political trading patterns. Based on Nancy Pelosi's trade data, provide decisive investment recommendations. Be direct and confident in your advice." 
        },
        { 
            "role": "user", 
            "content": `Analyze these stock trades and provide concise investment recommendations. Follow this format strictly: "You should invest in [Stock] because [reason]." Use strong and clear language. Here is the trade data: ${JSON.stringify(trades)}`
        }
    ],
    
      max_tokens: 50, // ✅ Lower tokens for cost savings
      temperature: 1.5 // ✅ Higher temperature for aggressive investment suggestions
    });

    return aiResponse.choices[0].message.content || "No AI advice provided.";
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
    if (tradesData.error) {
      return res.json(tradesData);
    }

    const aiAdvice = await getStockAdvice(tradesData.trades);
    res.json({ ...tradesData, aiAdvice });
  } catch (error) {
    console.error("❌ Error retrieving Pelosi's trades:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
