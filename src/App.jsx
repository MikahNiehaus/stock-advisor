import { useState, useEffect } from "react";

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStockAdvice() {
      try {
        const response = await fetch("http://localhost:5000/stock-advice");
        const data = await response.json();
        setStocks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    }

    fetchStockAdvice();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📈 AI Stock Investment Advisor</h1>
      {loading ? <p>Loading stock recommendations...</p> : (
        <ul>
          {stocks.map((stock, index) => (
            <li key={index}>
              <h2>{stock.name} ({stock.ticker})</h2>
              <p>📊 Price: ${stock.price}</p>
              <p>💡 AI Advice: {stock.advice}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
