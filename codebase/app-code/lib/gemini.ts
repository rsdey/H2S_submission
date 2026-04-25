import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy-init to avoid throwing during build when env vars aren't present
let _genAI: GoogleGenerativeAI | null = null;

export function getGenAI(): GoogleGenerativeAI {
  if (!_genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables");
    }
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
}

/** @deprecated Use getGenAI() instead for lazy initialization */
export const genAI = {
  getGenerativeModel: (...args: Parameters<GoogleGenerativeAI["getGenerativeModel"]>) =>
    getGenAI().getGenerativeModel(...args),
};

export const DEFAULT_MODEL = "gemini-2.5-flash";
