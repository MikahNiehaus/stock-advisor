import React from "react";

function AiAdvice({ aiAdvice }) {
  if (!aiAdvice || aiAdvice.trim() === "") {
    aiAdvice = "⚠️ No AI advice available.";
  }

  return (
    <div
      style={{
        backgroundColor: "#292929",
        padding: "15px",
        borderRadius: "10px",
        marginTop: "15px",
      }}
    >
      <h2 style={{ color: "#ffcc00" }}>📊 AI Investment Advice</h2>
      <p>
        <strong>💡 Recommendation:</strong>
      </p>
      <pre
        style={{
          backgroundColor: "#1E1E1E",
          padding: "10px",
          borderRadius: "5px",
          color: "#FFFFFF",
          whiteSpace: "pre-wrap",
        }}
      >
        {aiAdvice}
      </pre>
    </div>
  );
}

export default AiAdvice;
