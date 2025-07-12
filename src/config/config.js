import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const DATABASE_URL = process.env.DATABASE_URL;
export const ADDRESS = process.env.ADDRESS;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const GEMINI_API_KEY = process.env.GEMENI_API_KEY