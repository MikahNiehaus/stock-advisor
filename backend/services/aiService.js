import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getStockAdvice(trades) {
    try {
        if (!trades || trades.length === 0) {
            return "📊 AI Analysis: No new trade data available today.";
        }

        // Structure trade data to make it clearer for GPT
        const tradeSummary = trades.map(politicianTrade => {
            const politicianName = politicianTrade.politician;
            const tradeDetails = politicianTrade.trades.map(trade => 
                `${trade.politician} traded ${trade.stock} (${trade.transaction}) on ${trade.trade_date}`
            ).join("\n");
            return `Trades for ${politicianName}:\n${tradeDetails}`;
        }).join("\n\n");

        console.log("🧠 Sending AI request...");
        const aiResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are an overconfident stock adviser. Analyze politicians' stock trades and give investment advice." },
                { role: "user", content: `Based on this trade data, provide a direct investment recommendation:\n\n${tradeSummary}\n\nYou MUST follow this format: 'Invest in X because Y'` }
            ],
            max_tokens: 50,
        });

        return aiResponse.choices?.[0]?.message?.content || "📊 AI Analysis: No strong investment recommendation today.";
    } catch (error) {
        console.error("AI Error:", error.message);
        return "📊 AI Analysis: AI failed to generate advice.";
    }
}
