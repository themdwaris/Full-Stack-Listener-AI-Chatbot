// import axios from "axios";

// const openRouter = axios.create({
//   baseURL: "https://openrouter.ai/api/v1",
//   headers: {
//     Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//     "Content-Type": "application/json",
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "Chatbot Test App"
//   }
// });

// export async function main(prompt) {
//   try {
//     const response = await openRouter.post("/chat/completions", {
//     model: "meta-llama/llama-3-8b-instruct",
//     messages: [
//       {
//         role: "system",
//         content:
//           "You are a smart, helpful chatbot assistant designed to support users with clear, accurate, and practical answers."
//       },
//       {
//         role: "user",
//         content: prompt
//       }
//     ],
//     temperature: 0.7
//   });

//   return response.data.choices[0].message.content;
//   } catch (error) {
//     console.log("OpenRouter error:", error.response?.data); // ← exact error
//     throw error;

//   }
// }

export async function main(prompt, onChunk) {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Chatbot Test App",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "system",
              content: `You are an expert AI assistant with deep knowledge across multiple domains including technology, science, mathematics, history, and everyday problem-solving.

Your response style:
- Give clear, structured, and detailed answers
- Use examples and analogies to explain complex topics
- Break down multi-step problems step by step
- Be concise but never sacrifice accuracy for brevity
- If you don't know something, say so honestly instead of guessing
- Format responses with proper structure (use bullet points, numbering, or headers when helpful)
- Always prioritize practical and actionable information

Tone: Friendly, professional, and confident.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          stream: true, // ← stream on
        }),
      },
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const token = parsed.choices[0]?.delta?.content || "";
            if (token) {
              fullText += token;
              onChunk(token); // ← har token API route ko bhejo
            }
          } catch {}
        }
      }
    }

    return fullText;
  } catch (error) {
    console.log("OpenRouter error:", error);
    throw error;
  }
}
