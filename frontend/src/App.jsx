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
        padding: "20px", // Ensures spacing for mobile
      }}
    >
      <div
        style={{
          padding: "25px",
          fontFamily: "'Roboto', sans-serif",
          textAlign: "center",
          backgroundColor: "rgba(30, 30, 30, 0.9)",
          color: "#ffffff",
          borderRadius: "15px",
          paddingBottom: "20px",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h1
          style={{
            color: "#ffcc00",
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          📈 AI Stock Advisor
        </h1>

        <button
          onClick={fetchStockAnalysis}
          style={{
            padding: "14px 20px",
            fontSize: "18px",
            cursor: "pointer",
            backgroundColor: "#ffcc00",
            color: "#000",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            marginBottom: "20px",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          disabled={loading}
        >
          {loading ? "⏳ Loading..." : "📊 Get AI Stock Advice"}
        </button>

        {loading && <p style={{ color: "#bbbbbb" }}>⏳ Loading AI analysis...</p>}

        {timestamp && (
          <p style={{ fontSize: "14px", color: "#bbbbbb", marginBottom: "20px" }}>
            Last updated: {timestamp}
          </p>
        )}

        {aiAdvice && <AiAdvice aiAdvice={aiAdvice} />}
      </div>
    </div>
  );
}

export default App;
