import { YoutubeTranscript } from 'youtube-transcript';

const videoId = 'yjztvddhZmI'; // video ID only

YoutubeTranscript.fetchTranscript(videoId)
  .then((transcript) => {
    console.log("✅ Transcript length:", transcript.length);
    console.log(transcript.slice(0, 5)); // print first 5 entries
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
