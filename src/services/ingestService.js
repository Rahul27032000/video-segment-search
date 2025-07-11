import { pool } from '../config/dbConfig.js';
import { executeQuery } from './executeQuery.js';
import { getTextEmbedding } from './embedService.js';

const CHUNK_SEC = Number(process.env.CHUNK_SECONDS || 15);

export async function ingestTranscript(videoId, transcript) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insert =
      'INSERT INTO chunks (video_id,start_time,end_time,text,embedding) VALUES ($1,$2,$3,$4,$5)';

    for (const { start, end, text } of transcript) {
      const embedding = await getTextEmbedding(text);
      await executeQuery({
        text: insert,
        values: [videoId, start, end, text, embedding],
        client, 
      });
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}
