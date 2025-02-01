import express from "express";
import cors from "cors";
import OpenAI from "openai";
import axios from "axios";
import * as cheerio from "cheerio"; // ✅ Fix for ES Modules

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Load OpenAI API Key from environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERROR: OPENAI_API_KEY is missing!");
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Function to scrape stock data (Yahoo Finance Example)
async function fetchStockData(ticker) {
  try {
    const url = `https://finance.yahoo.com/quote/${ticker}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data); // ✅ Fix: Works with ES Modules

    const price = $('fin-streamer[data-field="regularMarketPrice"]').first().text();
    
    return {
      ticker,
      name: ticker.toUpperCase(),
      price: parseFloat(price.replace(/,/g, "")) || "N/A",
    };
  } catch (error) {
    console.error(`❌ Failed to fetch stock data for ${ticker}:`, error.message);
    return null;
  }
}

// ✅ Route to get AI-generated stock advice
app.get("/stock-advice", async (req, res) => {
  try {
    const tickers = ["AAPL", "GOOGL", "TSLA", "NVDA"]; // Stock tickers to fetch
    const stockData = await Promise.all(tickers.map(fetchStockData));

    // Remove failed fetches
    const validStocks = stockData.filter(stock => stock !== null);

    // ✅ Send stock data to OpenAI for investment advice
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a stock market expert providing investment advice." },
        { role: "user", content: `Given the following stock prices, which should be invested in and why? ${JSON.stringify(validStocks)}` }
      ]
    });

    const aiAdvice = aiResponse.choices[0].message.content;

    // ✅ Parse AI response into structured advice
    const adviceArray = aiAdvice.split("\n").map(advice => advice.trim()).filter(advice => advice);

    // ✅ Combine AI advice with stock data
    const result = validStocks.map((stock, index) => ({
      ...stock,
      advice: adviceArray[index] || "No specific advice provided.",
    }));

    res.json(result);
  } catch (error) {
    console.error("❌ Error generating stock advice:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
