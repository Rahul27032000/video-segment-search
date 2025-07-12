import fs from "node:fs/promises";
import path from "node:path";
import pool from "../config/dbConfig.js";
import { ingestTranscript } from "../services/ingestService.js";

async function main() {
  const [file, videoId] = process.argv.slice(2);
  if (!file || !videoId) {
    console.error("Usage: node scripts/ingest.js <transcript.json> <videoId>");
    process.exit(1);
  }

  const json = JSON.parse(await fs.readFile(path.resolve(file), "utf8"));
  console.log(`Ingesting ${json.length} chunks for video ${videoId}…`);
  await ingestTranscript(Number(videoId), json);
  console.log("Done");
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
