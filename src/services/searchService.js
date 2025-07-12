import pool from "../config/dbConfig.js";
import { getTextEmbedding } from "./embedService.js";

export async function searchBestChunk(queryText) {
  const embeddingArr = await getTextEmbedding(queryText);
  const embeddingVec = `[${embeddingArr.join(",")}]`;
  const sql = `
    SELECT vcm."videoId",
       v."title",
       c."startTime",
       c."endTime",
       c.text,
       1 - (c."embedding" <#> $1::vector) AS score    
      FROM "Chunk" c
      JOIN "VideoChunkMap" vcm ON c.id = vcm."chunkId"
      JOIN "Video" v ON vcm."videoId" = v.id
      WHERE vcm."isActive" = true
      ORDER BY c."embedding" <#> $1::vector
      LIMIT 1;

  `;

  const { rows } = await pool.query(sql, [embeddingVec]);
  return rows[0];
}
