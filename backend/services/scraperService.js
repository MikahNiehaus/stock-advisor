import puppeteer from "puppeteer";
import { checkIfDataChanged, storeTradesInDB, storeAiAdvice } from "./dbService.js";
import { getStockAdvice } from "./aiService.js";

const POLITICIANS = [
  { name: "Nancy Pelosi", url: "https://www.quiverquant.com/congresstrading/politician/Nancy%20Pelosi-P000197" },
  { name: "Michael Burgess", url: "https://www.quiverquant.com/congresstrading/politician/Michael%20Burgess-B001248" },
  { name: "Daniel Meuser", url: "https://www.quiverquant.com/congresstrading/politician/Daniel%20Meuser-M001204" },
];

/**
 * ✅ Scrapes stock trades for all politicians but stores only ONE AI advice per run.
 */
export async function fetchTradesForAllPoliticians() {
  console.log("🔍 Launching Puppeteer to scrape multiple politicians...");

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  let allTrades = [];

  try {
    for (const politician of POLITICIANS) {
      console.log(`📊 Checking if we need to scrape trades for ${politician.name}...`);

      const { isNewData, storedTrades, refreshAI } = await checkIfDataChanged([], politician.name);

      if (!isNewData && storedTrades.length > 0 && !refreshAI) {
        console.log(`⏳ Returning stored trades for ${politician.name}.`);
        allTrades.push({ politician: politician.name, trades: storedTrades });
        continue;
      }

      console.log(`🚀 Scraping trades for ${politician.name}...`);
      await page.goto(politician.url, { waitUntil: "networkidle2", timeout: 60000 });

      const tableExists = await page.$("table tbody tr");
      if (!tableExists) {
        console.warn(`⚠️ No trade data found for ${politician.name}. Skipping.`);
        allTrades.push({ politician: politician.name, trades: [] });
        continue;
      }

      await page.waitForSelector("table tbody tr", { timeout: 30000 });

      const trades = await page.evaluate(() => {
        const rows = document.querySelectorAll("table tbody tr");
        let extractedTrades = [];

        rows.forEach((row) => {
          const columns = row.querySelectorAll("td");
          if (columns.length >= 4) {
            const stock = columns[0]?.innerText.trim() || "N/A";
            const transactionType = columns[1]?.innerText.trim() || "Unknown";
            const tradeDate = columns[2]?.innerText.trim() || "Unknown";

            extractedTrades.push({
              stock,
              transaction: transactionType,
              trade_date: tradeDate,
            });
          }
        });

        return extractedTrades.length > 0 ? extractedTrades : [];
      });

      console.log(`✅ Scraped ${trades.length} trades for ${politician.name}`);
      allTrades.push({ politician: politician.name, trades });
    }
  } catch (error) {
    console.error("❌ Puppeteer Scraper Error:", error.message);
    return { error: "Failed to fetch trade data. Check if the page structure changed." };
  } finally {
    await browser.close();
  }

  // ✅ AI Advice is generated ONCE per run
  console.log("🧠 Generating AI advice...");
  const aiAdvice = await getStockAdvice(allTrades);
  await storeAiAdvice(aiAdvice);

  await storeTradesInDB(allTrades);
  return allTrades;
}
