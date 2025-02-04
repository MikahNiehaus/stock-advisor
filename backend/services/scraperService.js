import puppeteer from "puppeteer";
import { storeTradesInDB, getAllTrades } from "./dbService.js";

const POLITICIANS = [
  { name: "Nancy Pelosi", url: "https://www.quiverquant.com/congresstrading/politician/Nancy%20Pelosi-P000197" },
  { name: "Michael Burgess", url: "https://www.quiverquant.com/congresstrading/politician/Michael%20Burgess-B001248" },
  { name: "Daniel Meuser", url: "https://www.quiverquant.com/congresstrading/politician/Daniel%20Meuser-M001204" },
];

/**
 * ✅ Fetch and update the database by scraping **ONLY new trades**.
 */
export async function fetchAndUpdateDatabase() {
  console.log("🔍 Scraping and updating the database...");

  let allTrades = [];
  const existingTrades = await getAllTrades(); // Get all current trades in DB

  for (const politician of POLITICIANS) {
    console.log(`📊 Scraping trades for ${politician.name}...`);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(politician.url, { waitUntil: "networkidle2", timeout: 60000 });

    await page.waitForSelector("table tbody tr", { timeout: 30000 });

    const scrapedTrades = await page.evaluate((politicianName) => {
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

    await browser.close();

    // ✅ Filter out duplicate trades that already exist
    const newTrades = scrapedTrades.filter(
      (trade) =>
        !existingTrades.some(
          (existing) =>
            existing.stock === trade.stock &&
            existing.transaction === trade.transaction &&
            existing.trade_date === trade.trade_date &&
            existing.politician === trade.politician
        )
    );

    console.log(`✅ Found ${newTrades.length} new trades for ${politician.name}`);

    if (newTrades.length > 0) {
      await storeTradesInDB([{ politician: politician.name, trades: newTrades }]);
      allTrades.push({ politician: politician.name, trades: newTrades });
    }
  }

  return { trades: allTrades };
}
