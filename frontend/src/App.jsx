import { useState } from "react";

function StockAdvisor() {
  const [trades, setTrades] = useState([]);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  // ✅ Auto-detect local vs. production mode
  const LOCAL_BACKEND = "http://localhost:5000";
  const PRODUCTION_BACKEND = process.env.REACT_APP_BACKEND_URL || "https://stock-advisor-production.up.railway.app";

  const backendUrls = [
    process.env.NODE_ENV === "development" ? LOCAL_BACKEND : PRODUCTION_BACKEND,
    PRODUCTION_BACKEND, // Always try the production URL last
  ];

  const fetchStockAnalysis = async () => {
    setLoading(true);
    setTrades([]);
    setAiAdvice(null);
    setTimestamp(null);

    for (const url of backendUrls) {
      try {
        console.log(`🔍 Trying to fetch from: ${url}/politician-trades/nancy-pelosi/ai`);
        const response = await fetch(`${url}/politician-trades/nancy-pelosi/ai`);

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("✅ Response received:", data);

        // ✅ Set the data & stop looping
        setTrades(data.trades || []);
        setAiAdvice(data.aiAdvice || "No AI advice available.");
        setTimestamp(new Date().toLocaleString());
        return; // ✅ Exit the loop if request is successful
      } catch (error) {
        console.warn(`⚠️ Failed to fetch from: ${url}`, error.message);
      }
    }

    // ❌ If both API calls fail, show error
    setAiAdvice("❌ Unable to fetch data from both local and Railway servers.");
    setLoading(false);
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        borderRadius: "10px",
        paddingBottom: "20px",
      }}
    >
      <h1 style={{ color: "#ffcc00" }}>📈 AI Nancy Pelosi Stock Advisor</h1>

      <button
        onClick={fetchStockAnalysis}
        style={{
          padding: "12px 18px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#ffcc00",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          borderRadius: "5px",
          marginBottom: "15px",
        }}
        disabled={loading}
      >
        {loading ? "⏳ Loading..." : "📊 Get AI Stock Advice"}
      </button>

      {loading && <p>⏳ Loading AI analysis...</p>}

      {timestamp && (
        <p style={{ fontSize: "12px", color: "#bbbbbb" }}>Last updated: {timestamp}</p>
      )}

      {aiAdvice && (
        <div
          style={{
            backgroundColor: "#333",
            padding: "15px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#ffcc00" }}>📊 AI Investment Advice</h2>
          <p>
            <strong>💡 Recommendation:</strong> {aiAdvice}
          </p>
        </div>
      )}

      {trades.length > 0 && (
        <div
          style={{
            backgroundColor: "#292929",
            padding: "15px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(255, 255, 255, 0.2)",
          }}
        >
          <h3 style={{ color: "#ffcc00" }}>📝 Recent Stock Trades</h3>
          <ul
            style={{
              textAlign: "left",
              paddingLeft: "20px",
              listStyleType: "none",
            }}
          >
            {trades.map((trade, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  backgroundColor: "#444",
                  borderRadius: "5px",
                }}
              >
                <strong style={{ color: "#ffcc00" }}>{trade.stock}</strong>:{" "}
                {trade.transaction} on {trade.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StockAdvisor;
