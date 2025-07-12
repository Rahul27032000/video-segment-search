import { pool } from "../config/dbConfig.js";
import { executeQuery } from "../utils/executeQuery.js";
import { getTextEmbedding } from "./embedService.js";
import { YoutubeTranscript } from 'youtube-transcript';
import ytdl from 'ytdl-core';
import { getSubtitles } from 'youtube-captions-scraper';
export async function ingestTranscript(videoId, transcript) {
  console.log("this is the transcript",transcript)
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
export async function ingestTranscriptHandler(req, res, next) {
  const { videoId } = req.params;
  const transcript = req.body;            

  if (!Array.isArray(transcript) || !videoId) {
    return res.status(400).json({ message: 'videoId param and transcript array required' });
  }

  try {
    await ingestTranscript(Number(videoId), transcript);
    await pool.end();                     
    return res.status(200).json({ message: 'Transcript ingested successfully' });
  } catch (err) {
    return next(err);
  }
}

// console.log(transcriptPkg
export async function ingestFromYouTube(req, res, next) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ message: 'YouTube URL is required' });

  try {
    const videoId = ytdl.getVideoID(url);  
    console.log(url,"this isthe url",videoId)
    const captions = await getCaptions(url,videoId)
    // const aptionsAnother = await getCaptionsAnother(url,videoId)
    
    console.log(captions,"this is captions")
    console.log(aptionsAnother,"this is captions another")
    const info = await ytdl.getBasicInfo(videoId);
    const title = info.videoDetails.title;
    YoutubeTranscript.fetchTranscript(videoId).then(console.log);
    const transcriptRaw = await YoutubeTranscript.fetchTranscript('yjztvddhZmI');
    // const transcriptRaw = await YoutubeTranscript.fetchTranscript(videoId);
    console.log(transcriptRaw, "this is raw transcript")
    const transcript = transcriptRaw.map((item) => ({
      start: Math.floor(item.offset / 1000), 
      end: Math.floor((item.offset + item.duration) / 1000),
      text: item.text,
    }));
    const client = await pool.connect();
    await client.query('BEGIN');

    const {
      rows: [{ id: insertedVideoId }],
    } = await executeQuery({
      client,
      text: `
        INSERT INTO "Video" (title, url, "isActive")
        VALUES ($1, $2, true)
        RETURNING id;
      `,
      values: [title, url],
    });
    await ingestTranscript(insertedVideoId, transcript, client);
    await client.query('COMMIT');
    client.release();

    res.status(200).json({
      message: 'Transcript ingested from YouTube successfully',
      videoId: insertedVideoId,
      title,
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

export async function ingestWithTranscriptBody(req, res, next) {
  const { url, title: customTitle, transcript } = req.body;

  // 1️⃣ Validate input synchronously
  if (!url || !Array.isArray(transcript) || !transcript.length) {
    return res.status(400).json({ message: 'url and non‑empty transcript required' });
  }
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ message: 'Invalid YouTube URL' });
  }

  // 🔍 Extract title synchronously to include in response
  let videoTitle = customTitle;
  try {
    const videoId = ytdl.getVideoID(url);
    const info = await ytdl.getBasicInfo(videoId);
    videoTitle = customTitle || info.videoDetails.title;
  } catch (err) {
    return res.status(400).json({ message: 'Failed to fetch video info', error: err.message });
  }

  // 2️⃣ Respond early with extracted title
  res.status(202).json({
    message: 'Ingest queued',
    title: videoTitle
  });

  // 3️⃣ Kick off background work
  (async () => {
    try {
      const videoId = ytdl.getVideoID(url);

      const isValid = transcript.every(
        t => typeof t.start === 'number' && typeof t.end === 'number' && typeof t.text === 'string'
      );
      if (!isValid) throw new Error('Malformed transcript array');

      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        const { rows: [{ id: vid }] } = await executeQuery({
          client,
          text: `INSERT INTO "Video"(title, url, "isActive")
                 VALUES ($1,$2,true) RETURNING id`,
          values: [videoTitle, url],
        });

        await ingestTranscript(vid, transcript, client);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('🚨 Background ingest failed:', err);
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('🚨 Could not start ingest:', err);
    }
  })();
}






export async function getCaptions(urlOrId, lang = 'en') {
  const videoId = urlOrId.includes('youtube')
    ? new URL(urlOrId).searchParams.get('v')
    : urlOrId;

  const items = await getSubtitles({ videoID: videoId, lang });
  // library returns { start, dur, text }
  return items.map((c) => ({
    start: c.start,
    end: c.start + c.dur,
    text: c.text,
  }));
}

