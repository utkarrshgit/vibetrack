const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const tagSession = async (messages) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          sentiment: {
            type: SchemaType.STRING,
            enum: ["positive", "neutral", "negative"],
          },
          moodScore: {
            type: SchemaType.INTEGER,
            description: "Mood score between 1 and 10",
          },
          tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        },
        required: ["sentiment", "moodScore", "tags"],
      },
    },
  });

  const prompt = `Analyze the following chat session and return the sentiment, mood score (1-10), and topic tags.\n\nMessages:\n${messages.map((m) => m.text).join("\n")}`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { sentiment: "neutral", moodScore: 5, tags: ["untagged"] };
  }
};

module.exports = { tagSession };
