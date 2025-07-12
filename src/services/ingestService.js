import { pool } from "../config/dbConfig.js";
import { executeQuery } from "../utils/executeQuery.js";
import { getTextEmbedding } from "./embedService.js";

export async function ingestTranscript(videoId, transcript) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertChunk = `
      INSERT INTO "Chunk" ("videoId", "startTime", "endTime", text, "embedding")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const insertMap = `
      INSERT INTO "VideoChunkMap" ("videoId","chunkId")
      VALUES ($1,$2);
    `;

    for (const { start, end, text } of transcript) {
      const embedding = await getTextEmbedding(text);

      const {
        rows: [{ id: chunkId }],
      } = await executeQuery({
        text: insertChunk,
        values: [videoId,start, end, text, `[${embedding.join(',')}]`],
        client,
      });

      await executeQuery({
        text: insertMap,
        values: [videoId, chunkId],
        client,
      });
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
