import React from "react";

function About() {
  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h1>About Mikah Niehaus</h1>
      <p>
        Hi, I’m <strong>Mikah Niehaus</strong>, a <strong>Certified AI Developer</strong> and experienced 
        <strong> Full Stack Software Engineer</strong> specializing in AI-driven solutions and cloud-native 
        architectures. With over 6 years of hands-on experience, I build high-performance applications that 
        integrate AI, machine learning, and large-scale distributed systems.
      </p>
      <p>
        My technical expertise includes <strong>C#, .NET Core, Python, Java, Node.js, Kubernetes, Docker, 
        and cloud platforms like AWS, Google Cloud, and Azure.</strong> I’ve developed AI models that analyze 
        financial data, optimize trading strategies, and enhance decision-making for users looking to gain 
        an edge in the market.
      </p>
      <p>
        In my previous roles, I have:
      </p>
      <ul style={{ textAlign: "left", maxWidth: "700px", margin: "auto" }}>
        <li>Designed and implemented <strong>.NET Core microservices</strong> for scalable applications.</li>
        <li>Developed AI-powered analytics tools for <strong>financial markets and logistics systems</strong>.</li>
        <li>Optimized <strong>CI/CD pipelines with Kubernetes, Docker, and Jenkins</strong> to streamline deployment.</li>
        <li>Integrated <strong>machine learning models</strong> to predict market movements and trading patterns.</li>
        <li>Built high-performance <strong>RESTful APIs</strong> and microservices used in fintech and e-commerce.</li>
      </ul>
      <p>
       
      </p>

      <h1>About AI Stock Advisor</h1>
      <p>
        AI Stock Advisor is an AI-powered tool designed to analyze stock market data, focusing on trades made
        by politicians. The application leverages publicly available stock data and advanced AI 
        techniques to identify potential market opportunities and help users outperform the market.
      </p>

      <h2>Why Use Politician Stock Data?</h2>
      <p>
        Studies have shown that trades made by politicians often outperform the market, potentially due to insider 
        knowledge or their positions of influence. By analyzing this data, we can uncover patterns and trends that may 
        provide a competitive edge to individual investors.
      </p>
      <p>
        A 2011 study by the University of Georgia titled{" "}
        <em>"Abnormal Returns From the Common Stock Investments of the U.S. Senate"</em> found that 
        stocks purchased by senators outperformed the market by an average of 12% annually.
      </p>

      <h2>How It Works</h2>
      <ul style={{ textAlign: "left", maxWidth: "700px", margin: "auto" }}>
        <li>Publicly available stock data from politicians is collected and stored in a database.</li>
        <li>The AI analyzes this data to identify profitable trades and market trends.</li>
        <li>Users can request AI-generated advice based on the most recent data.</li>
      </ul>

      <p>
        <a
          href="mailto:mikah.niehaus@gmail.com"
          style={{ color: "#00ffff", textDecoration: "none", fontWeight: "bold" }}
        >
          Contact Me
        </a>
      </p>
    </div>
  );
}

export default About;
