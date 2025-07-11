import OpenAI from 'openai';
import fetch, { Headers, Request, Response } from 'node-fetch';
import { Blob } from 'buffer';
import { FormData } from 'formdata-node'; // ✅ Add FormData

// Polyfill all required Fetch API globals
globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Blob = Blob;
globalThis.FormData = FormData; // ✅ Fixes "FormData is not defined"

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch,
});
