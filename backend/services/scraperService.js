import puppeteer from "puppeteer";
import { checkIfDataChanged, storeTradesInDB, getTodaysTrades } from "./dbService.js";
import { generateAiAdviceIfNeeded } from "./aiService.js";

const POLITICIANS = [
  { name: "Nancy Pelosi", url: "https://www.quiverquant.com/congresstrading/politician/Nancy%20Pelosi-P000197" },
  { name: "Michael Burgess", url: "https://www.quiverquant.com/congresstrading/politician/Michael%20Burgess-B001248" },
  { name: "Daniel Meuser", url: "https://www.quiverquant.com/congresstrading/politician/Daniel%20Meuser-M001204" },
];

/**
 * ✅ Fetch trades for all politicians **ONLY if needed**.
 */
export async function fetchTradesForAllPoliticians() {
  console.log("🔍 Checking if scraping is needed...");
  let allTrades = [];

  for (const politician of POLITICIANS) {
    console.log(`📊 Checking trades for ${politician.name}...`);

    // ✅ Check if today's trades exist in DB
    const todaysTrades = await getTodaysTrades(politician.name);
    if (todaysTrades.length > 0) {
      console.log(`⏳ Trades for ${politician.name} already exist today. Skipping scraping.`);
      allTrades.push({ politician: politician.name, trades: todaysTrades });
      continue; // Skip scraping
    }

    // ✅ If no data, scrape using Puppeteer
    console.log(`🚀 Scraping trades for ${politician.name}...`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(politician.url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector("table tbody tr", { timeout: 30000 });
    const trades = await page.evaluate((politicianName) => {
      const rows = document.querySelectorAll("table tbody tr");
      let extractedTrades = [];

      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length >= 4) {
          const stock = columns[0]?.innerText.trim() || "N/A";
          const transactionType = columns[1]?.innerText.trim() || "Unknown";
          const transactionDate = columns[2]?.innerText.trim() || "Unknown";

          extractedTrades.push({
            politician: politicianName,
            stock,
            transaction: transactionType,
            trade_date: transactionDate,
          });
        }
      });

      return extractedTrades;
    }, politician.name);

    console.log(`✅ Scraped ${trades.length} trades for ${politician.name}`);
    await storeTradesInDB([{ politician: politician.name, trades }]);
    allTrades.push({ politician: politician.name, trades });

    await browser.close();
  }

  // ✅ AI ADVICE LOGIC
  console.log("🧠 Checking if AI advice is needed...");
  const aiAdvice = await generateAiAdviceIfNeeded(allTrades.flatMap(p => p.trades));

  return { trades: allTrades, aiAdvice };
}
