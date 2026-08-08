import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function ai() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY missing. Add it to apps/web/.env");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

/** Call Gemini 2.5 Flash and parse a JSON response. */
export async function generateJson<T>(prompt: string, systemInstruction?: string): Promise<T> {
  const res = await ai().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });
  const text = res.text;
  if (!text) throw new Error("Gemini returned empty response");
  try {
    return JSON.parse(text) as T;
  } catch {
    // Model occasionally wraps JSON in fences despite mime type
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("Gemini response was not valid JSON");
  }
}

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  const res = await ai().models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { systemInstruction, temperature: 0.7 },
  });
  return res.text ?? "";
}
