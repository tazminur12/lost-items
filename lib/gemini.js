import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const MODEL = "gemini-3-flash-preview";

export async function generateText(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text;
}

export async function generateJSON(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt + "\n\nReturn ONLY valid JSON, no markdown, no code fences, no other text.",
  });

  const raw = response.text.trim();
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}
