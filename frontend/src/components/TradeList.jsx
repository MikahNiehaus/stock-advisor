import React from "react";

const TradeList = ({ trades }) => {
  return (
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
            <strong style={{ color: "#ffcc00" }}>{trade.politician} - {trade.stock}</strong>:{" "}
            {trade.transaction} on {trade.trade_date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TradeList;
