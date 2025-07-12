import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMENI_API_KEY } from './config.js';

export const genAI = new GoogleGenerativeAI(GEMENI_API_KEY);