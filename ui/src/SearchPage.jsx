import { useState } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `http://localhost:3000/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Search failed:", err);
    }
    setLoading(false);
  };

  return (
    <>
      <h1>🔎 AI Video Segment Finder</h1>
      <p>
        Ask a question and we’ll find the most relevant moment from the video
        using AI.
      </p>

      <input
        type="text"
        placeholder="E.g. What is the battery capacity of Nexon EV Max?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "🤖 Thinking..." : "Search 🔍"}
      </button>

      {result && (
        <div className="result-card">
          <h2>🎯 Top Match</h2>
          <p>
            <strong style={{ color: "#1d4ed8" }}>📼 Video ID:</strong>{" "}
            {result.videoId}
          </p>
          <p>
            <strong style={{ color: "#1d4ed8" }}> Video Title:</strong>{" "}
            {result.title}
          </p>
          <p>
            <strong style={{ color: "#059669" }}>⏱ Timestamp:</strong>{" "}
            {result.startTime}s – {result.endTime}s
          </p>
          <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
            “{result.text}”
          </p>
          <p
            style={{ marginTop: "1rem", fontSize: "0.95rem", color: "#6b7280" }}
          >
            🧠 Similarity Score: <strong>{result.score.toFixed(4)}</strong>
          </p>
        </div>
      )}
    </>
  );
}

export default SearchPage;