import React, { useState } from "react";
import AiAdvice from "./components/AiAdvice";

const backendUrl = process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://stock-advisor-production.up.railway.app";

function App() {
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);

  const updateDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/update-database`, { method: "POST" });
      const data = await response.json();
      console.log("✅ Database updated:", data.message);
    } catch (error) {
      console.error("❌ Error updating database:", error);
    }
    setLoading(false);
  };

  const fetchAiAdvice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/get-ai-advice`);
      const data = await response.json();
      setAiAdvice(data.aiAdvice);
    } catch (error) {
      console.error("❌ Error fetching AI advice:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>📈 AI Stock Advisor</h1>

      <button
        onClick={updateDatabase}
        disabled={loading}
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          margin: "10px",
          backgroundColor: loading ? "#aaa" : "#ffcc00",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "⏳ Updating Database..." : "📂 Update Database"}
      </button>

      <button
        onClick={fetchAiAdvice}
        disabled={loading}
        style={{
          padding: "10px 15px",
          fontSize: "16px",
          margin: "10px",
          backgroundColor: loading ? "#aaa" : "#ff9900",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "⏳ Fetching AI Advice..." : "💡 Get AI Advice"}
      </button>

      {aiAdvice && <AiAdvice aiAdvice={aiAdvice} />}
    </div>
  );
}

export default App;
