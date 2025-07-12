import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import fetch, { Headers, Request, Response } from "node-fetch";
import { GEMINI_API_KEY, OPENAI_API_KEY } from "../config/config.js";


globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;

const openai = OPENAI_API_KEY && new OpenAI({ apiKey: OPENAI_API_KEY, fetch });
const genAI = GEMINI_API_KEY && new GoogleGenerativeAI(GEMINI_API_KEY);


export async function getTextEmbedding(text) {
  if (genAI) {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent({
      content: {
        parts: [{ text }], 
      },
      taskType: "RETRIEVAL_DOCUMENT",
    });
    return result.embedding.values; 
  }

  
  if (openai) {
    const res = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return res.data[0].embedding; 
  }

  throw new Error(
    "No embedding provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY in .env"
  );
}

export const getTextEmbeddingWithGemini = getTextEmbedding; // same as default
export async function getTextEmbeddingWithOpenai(text) {
  if (!openai) throw new Error("OPENAI_API_KEY not set");
  const res = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return res.data[0].embedding;
}
