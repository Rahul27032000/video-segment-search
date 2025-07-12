import pool from "../config/dbConfig.js";
import { getTextEmbedding } from "./embedService.js";

export async function searchBestChunk(queryText) {
  const embedding = await getTextEmbedding(queryText);
  // const embedding = "[0.123, 0.456, 0.789]"
  const sql = `
    SELECT vcm."videoId", c."startTime", c."endTime", c.text,
             1 - (c."embedding" <#> $1) AS score
      FROM "Chunk" c
      JOIN "VideoChunkMap" vcm ON c.id = vcm."chunkId"
      WHERE vcm."isActive" = true
      ORDER BY c."embedding" <#> $1
      LIMIT 1;
  `;
  const { rows } = await pool.query(sql, [embedding]);
  console.log(rows);
  return rows[0];
}
