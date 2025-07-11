import pool from '../config/dbConfig.js';
import { getTextEmbedding } from './embedService.js';

export async function searchBestChunk(queryText) {
  const embedding = await getTextEmbedding(queryText);

  const sql = `
    SELECT video_id, start_time, text,
           1 - (embedding <#> $1) AS score
    FROM chunks
    ORDER BY embedding <#> $1     -- L2 distance
    LIMIT 1;
  `;
  const { rows } = await pool.query(sql, [embedding]);
  return rows[0];
}
