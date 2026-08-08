import { generateJson } from "./gemini";

export type BusinessKB = {
  businessName: string;
  overview: string;
  whatItDoes: string;
  targetAudience: string;
  audienceSegments: string[];
  competitors: string[];
  usp: string;
  pricing: string;
  testimonials: string[];
  brandTone: string;
  brandVoice: string;
  brandPersonality: string;
  brandIdentity: string;
  keyBenefits: string[];
  objections: string[];
  suggestedSubreddits: string[];
  contentThemes: string[];
};

export const EMPTY_KB: BusinessKB = {
  businessName: "",
  overview: "",
  whatItDoes: "",
  targetAudience: "",
  audienceSegments: [],
  competitors: [],
  usp: "",
  pricing: "",
  testimonials: [],
  brandTone: "",
  brandVoice: "",
  brandPersonality: "",
  brandIdentity: "",
  keyBenefits: [],
  objections: [],
  suggestedSubreddits: [],
  contentThemes: [],
};

const SYSTEM = `You are a senior marketing strategist (MBA, 15 years in digital marketing, storytelling and brand building). You extract a rigorous marketing knowledge base from raw business context. Never invent facts: if something is not in the context, return an empty string or empty array for that field. Suggested subreddits should be real, active subreddits where the target audience genuinely hangs out (no r/ prefix).`;

export async function extractKB(input: {
  websiteUrl?: string;
  websiteText?: string;
  description?: string;
  promote?: string;
}): Promise<BusinessKB> {
  const prompt = `Build a marketing knowledge base for this business.

${input.websiteUrl ? `WEBSITE: ${input.websiteUrl}` : ""}
${input.description ? `OWNER DESCRIPTION:\n${input.description}` : ""}
${input.promote ? `WHAT THEY WANT TO PROMOTE:\n${input.promote}` : ""}
${input.websiteText ? `WEBSITE CONTENT (scraped, plain text):\n${input.websiteText}` : ""}

Return JSON exactly matching this TypeScript type (all fields required):
{
  "businessName": string,           // short brand name
  "overview": string,               // 2-3 sentences: what the business/product/idea is about
  "whatItDoes": string,             // what it does and how it helps
  "targetAudience": string,         // who the ideal customer is, 1-2 sentences
  "audienceSegments": string[],     // 3-6 concrete segments/personas e.g. "busy moms", "indie hackers"
  "competitors": string[],          // named competitors found in context, else []
  "usp": string,                    // unique selling proposition
  "pricing": string,                // prices/costs found in context, else ""
  "testimonials": string[],         // verbatim reviews/testimonials found, else []
  "brandTone": string,              // e.g. "warm, playful"
  "brandVoice": string,             // how the brand speaks
  "brandPersonality": string,
  "brandIdentity": string,          // visual/positioning identity summary
  "keyBenefits": string[],          // 3-6 benefits phrased for customers
  "objections": string[],           // common objections a buyer would raise
  "suggestedSubreddits": string[],  // 5-8 real subreddits (no "r/" prefix) where target audience is active
  "contentThemes": string[]         // 4-6 organic content angles worth posting about
}`;

  return generateJson<BusinessKB>(prompt, SYSTEM);
}
