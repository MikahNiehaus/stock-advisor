import React from "react";

function AiAdvice({ aiAdvice }) {
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
        <strong>💡 Recommendation:</strong> {aiAdvice}
      </p>
    </div>
  );
}

export default AiAdvice;
