// src/ManualIngestPage.jsx
import { useState } from "react";

function ManualIngestPage() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [transcriptText, setTranscriptText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url.trim() || !transcriptText.trim()) {
      setStatus("⚠️ Please provide a valid YouTube URL and transcript JSON.");
      return;
    }

    let parsedTranscript;
    try {
      parsedTranscript = JSON.parse(transcriptText);
      if (!Array.isArray(parsedTranscript)) throw new Error();
    } catch {
      setStatus("❌ Invalid JSON format for transcript.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch("http://localhost:3000/api/videos/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, transcript: parsedTranscript }),
      });

      const result = await res.json();
      setStatus(
        res.ok
          ? `✅ Ingested successfully! Video Title: ${result.title}`
          : `❌ Failed: ${result.message || "Unknown error"}`
      );
      setTitle("")
      setTranscriptText("")
      setUrl("")
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed.");
    }

    setLoading(false);
  };

  return (
    <>
      <h1>📎 Manual Transcript Upload</h1>
      <p>Provide a YouTube video URL and paste a transcript in JSON format.</p>

      <input
        type="text"
        placeholder="YouTube Video URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        type="text"
        placeholder="Optional Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        rows={10}
        style={{
          width: "100%",
          marginTop: "1rem",
          padding: "1rem",
          fontFamily: "monospace",
        }}
        placeholder={`Paste transcript JSON here\nExample: [\n  { "start": 0, "end": 5, "text": "Hello world" }\n]`}
        value={transcriptText}
        onChange={(e) => setTranscriptText(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Submit Transcript"}
      </button>

      {status && (
        <p style={{ marginTop: "1.5rem", color: "#4b5563" }}>{status}</p>
      )}
    </>
  );
}

export default ManualIngestPage;
