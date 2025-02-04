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

    console.log("🧠 Sending AI request with ALL trade data...");

    const aiResponse = await openai.chat.completions.create({
      model: "o3-mini",
      messages: [
        {
          role: "system",
          content: "You are a highly creative and concise expert stock analyst. Generate very short and imaginative investment advice based on trade data and recent events."
        },
        {
          role: "user",
          content: `Analyze ALL these trades from all politicians: ${JSON.stringify(
            trades
          )}. With this info and a bit of your own research, give a very concise and creative investment recommendation, like: 'Invest in X because of Y.'`
        }
      ],
      max_tokens: 300, // Strict limit for concise responses
      temperature: 1.2, // High creativity (values >1 increase randomness)
      frequency_penalty: 0.8, // Reduce repetition
      presence_penalty: 1.0, // Encourage new and creative ideas
    });
    
    

    return aiResponse.choices?.[0]?.message?.content || "AI response unavailable.";
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    return "AI failed.";
  }
}

