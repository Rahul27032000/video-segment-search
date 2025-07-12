import { useState } from "react";

function TranscriptUpload() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIngestFromYouTube = async () => {
    if (!youtubeUrl.trim()) {
      setStatus("⚠️ Please provide a YouTube URL.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:3000/api/videos/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      const result = await res.json();
      setStatus(
        res.ok
          ? `✅ Ingested: "${result.title}" (Video ID: ${result.videoId})`
          : `❌ Failed: ${result.message || "Unknown error"}`
      );
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed or invalid YouTube URL.");
    }

    setLoading(false);
  };

  return (
    <>
      <h1>📥 Ingest Transcript from YouTube</h1>
      <p>
        Paste a YouTube video URL to fetch the title and transcript and ingest it into the system.
      </p>

      <input
        type="url"
        placeholder="Enter YouTube Video URL"
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
      />

      <button onClick={handleIngestFromYouTube} disabled={loading}>
        {loading ? "Fetching Transcript..." : "Ingest from YouTube"}
      </button>

      {status && <p className="status-message">{status}</p>}


    </>
  );
}

export default TranscriptUpload;
