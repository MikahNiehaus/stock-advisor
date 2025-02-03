        import puppeteer from "puppeteer";

        /**
         * Scrapes Daniel Meuser's stock trades using Puppeteer.
         */
        export async function fetchPelosiTrades() {

          const url = "https://www.quiverquant.com/congresstrading/politician/Daniel%20Meuser-M001204";
          console.log(`🔍 Launching Puppeteer to scrape ${url}...`);
        
          // Launch Puppeteer
          const browser = await puppeteer.launch({ headless: true });
          const page = await browser.newPage();
        
          try {
            await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        
            // Wait for table rows to load
            await page.waitForSelector("table tbody tr", { timeout: 30000 });
        
            // Extract trade data
            const trades = await page.evaluate(() => {
              const rows = document.querySelectorAll("table tbody tr");
              let extractedTrades = [];
        
              rows.forEach((row) => {
                const columns = row.querySelectorAll("td");
        
                if (columns.length >= 4) {
                  const stock = columns[0]?.innerText.trim() || "N/A";
                  const transactionType = columns[1]?.innerText.trim() || "Unknown";
                  const transactionDate = columns[2]?.innerText.trim() || "Unknown";
                  const reportDate = columns[3]?.innerText.trim() || "Unknown";
        
                  extractedTrades.push({ stock, transactionType, transactionDate, reportDate });
                }
              });
        
              return extractedTrades;
            });
        
            console.log(`✅ Successfully scraped ${trades.length} trades.`);
            return trades;
          } catch (error) {
            console.error("❌ Puppeteer Scraper Error:", error.message);
            return { error: "Failed to fetch trade data. Check if the page structure changed." };
          } finally {
            await browser.close();
          }
        }
        