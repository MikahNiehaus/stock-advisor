import React, { useState } from "react";
import AiAdvice from "./components/AiAdvice";
import About from "./components/About"; // Import the new About page
import "./App.css"; // Import the new CSS file

const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://stock-advisor-production.up.railway.app";

function App() {
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [showAbout, setShowAbout] = useState(false); // Toggle between Home and About

  const updateDatabase = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/update-database`, {
        method: "POST",
      });
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
    <div className="app-container">
      <header>
        <nav className="nav-bar">
          <button
            onClick={() => setShowAbout(false)}
            className={`nav-button ${!showAbout ? "active" : ""}`}
          >
            Home
          </button>
          <button
            onClick={() => setShowAbout(true)}
            className={`nav-button ${showAbout ? "active" : ""}`}
          >
            About
          </button>
        </nav>
      </header>

      {!showAbout ? (
        <main>
          <h1>📈 AI Stock Advisor</h1>

          <button
            onClick={updateDatabase}
            disabled={loading}
            className={`action-button ${loading ? "disabled" : ""}`}
          >
            {loading ? "⏳ Updating Database..." : "📂 Update Database"}
          </button>

          <button
            onClick={fetchAiAdvice}
            disabled={loading}
            className={`action-button ${loading ? "disabled" : ""}`}
          >
            {loading ? "⏳ Fetching AI Advice..." : "💡 Get AI Advice"}
          </button>

          {aiAdvice && <AiAdvice aiAdvice={aiAdvice} />}
        </main>
      ) : (
        <About /> // Render the About page
      )}

      <footer className="footer">
        <p>
          Created by <strong>Mikah Niehaus</strong> |{" "}
          <a href="mailto:mikah.niehaus@gmail.com">mikah.niehaus@gmail.com</a>
        </p>
        <p>
          <a
            href="https://github.com/MikahNiehaus/stock-advisor"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 View Code
          </a>{" "}
          |{" "}
          <a
            href="https://linkedin.com/in/mikahniehaus"
            target="_blank"
            rel="noopener noreferrer"
          >
            💼 LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
