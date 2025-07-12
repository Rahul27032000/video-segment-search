import { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Search failed:', err);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🔎 Video Segment Search</h1>
      <input
        type="text"
        placeholder="Ask a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {result && (
        <div className="result-card">
          <h2>📺 Result</h2>
          <p><strong>Video ID:</strong> {result.videoId}</p>
          <p><strong>Timestamp:</strong> {result.startTime}s - {result.endTime}s</p>
          <p><strong>Text:</strong> “{result.text}”</p>
          <p><strong>Score:</strong> {result.score.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

export default App;
