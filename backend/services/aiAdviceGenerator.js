import OpenAI from "openai"; 
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * ✅ Generate AI stock advice based on trade data.
 */
export async function getStockAdvice(trades) {
  try {
    if (!trades || trades.length === 0) {
      return "No trades available for AI analysis.";
    }

    console.log("🧠 Sending AI request...");

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an expert stock analyst. Provide short investment advice based on trade data." },
        { role: "user", content: `Analyze these trades: ${JSON.stringify(trades)}. Give a concise investment recommendation.` }
      ],
      max_tokens: 1000,
    });

    return aiResponse.choices?.[0]?.message?.content || "AI response unavailable.";
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    return "AI failed.";
  }
}
