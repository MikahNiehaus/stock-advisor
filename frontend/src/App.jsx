import React, { useState, useEffect } from "react";
import TradeList from "./components/TradeList";
import AiAdvice from "./components/AiAdvice";
import { fetchStockTrades, fetchAiAdvice } from "./services/apiService";

function App() {
  const [trades, setTrades] = useState([]);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    console.log("✅ App component has mounted!"); // 🔥 Debugging log
  }, []);

  const fetchStockAnalysis = async () => {
    setLoading(true);
    setTrades([]);
    setAiAdvice(null);
    setTimestamp(null);

    try {
      const tradesData = await fetchStockTrades();
      const aiResponse = await fetchAiAdvice();

      setTrades(tradesData || []);
      setAiAdvice(aiResponse || "No AI advice available.");
      setTimestamp(new Date().toLocaleString());
    } catch (error) {
      setAiAdvice("❌ Unable to fetch stock data or AI insights.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
      }}
    >
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          maxWidth: "600px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#1e1e1e",
          color: "#ffffff",
          borderRadius: "10px",
          paddingBottom: "20px",
          boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
        }}
      >
        <h1 style={{ color: "#ffcc00" }}>📈 AI Stock Advisor</h1>

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
          <p style={{ fontSize: "12px", color: "#bbbbbb" }}>
            Last updated: {timestamp}
          </p>
        )}

        {aiAdvice && <AiAdvice aiAdvice={aiAdvice} />}
        {trades.length > 0 && <TradeList trades={trades} />}
      </div>
    </div>
  );
}

export default App;
