# Stock Advisor - AI-Powered Investment Insights

## 🚀 Overview
Stock Advisor is a **full-stack application** that scrapes real-time stock data from **Yahoo Finance** and uses **OpenAI's GPT-4 Turbo** to provide investment insights. The AI analyzes the latest financial data for each stock and classifies them as **INVEST** or **DISINVEST**, explaining why.

## 📌 Features
✅ **Scrapes live stock data** (Price, Market Cap, PE Ratio, EPS, 52-Week Range, Earnings Date, Volume).  
✅ **Filters outdated information** to ensure **only recent data** is considered.  
✅ **AI-based stock analysis** using **GPT-4 Turbo** to determine investment potential.  
✅ **REST API endpoint** to fetch investment insights.

## 🛠 Installation & Setup

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/MikahNiehaus/stock-advisor.git
cd stock-advisor
```

### 2️⃣ **Set Up the Backend**
```sh
cd backend
npm install
```

### 3️⃣ **Set OpenAI API Key**
#### **Windows (PowerShell)**
```sh
$env:OPENAI_API_KEY="enter your openai key here"
```
#### **Mac/Linux**
```sh
export OPENAI_API_KEY="enter your openai key here"
```

### 4️⃣ **Start Backend Server**
```sh
node server.js
```
✅ **Server running at:** `http://localhost:5000`

### 5️⃣ **Set Up the Frontend**
```sh
cd ../frontend
npm install
npm run dev
```
✅ **Frontend running at:** `http://localhost:5173`

## 🎯 How It Works
1️⃣ **Scrapes stock data from Yahoo Finance** (Price, Market Cap, PE Ratio, etc.).  
2️⃣ **Sends the latest stock details to GPT-4 Turbo for AI-based analysis.**  
3️⃣ **AI decides whether to INVEST or DISINVEST** and explains why.  
4️⃣ **Frontend displays stock recommendations and reasons.**  

## 📡 API Endpoint
### **GET `/stock-advice`**
Fetches stock investment insights.
#### **Example Response**
```json
[
  {
    "ticker": "AAPL",
    "price": "185.62",
    "marketCap": "3.02T",
    "peRatio": "32.14",
    "eps": "5.72",
    "yearRange": "128.21 - 198.23",
    "earningsDate": "April 23, 2024",
    "volume": "55.3M",
    "advice": "INVEST - Apple has strong earnings and a growing market capitalization."
  },
  {
    "ticker": "TSLA",
    "price": "202.12",
    "marketCap": "0.78T",
    "peRatio": "NA",
    "eps": "0.82",
    "yearRange": "180.10 - 250.50",
    "earningsDate": "May 2, 2024",
    "volume": "33.2M",
    "advice": "DISINVEST - High volatility and recent negative earnings report."
  }
]
```

## 📜 License
This project is open-source and free to use.

## ✨ Contributing
Pull requests and improvements are welcome!

## 📞 Contact
For questions or issues, reach out via GitHub or email `your-email@example.com`.

