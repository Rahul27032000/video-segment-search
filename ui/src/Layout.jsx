import { Link } from "react-router-dom";
import "./App.css";

function Layout({ children }) {
  return (
    <div className="container">
      <nav style={{ marginBottom: "1.5rem" }}>
        <Link to="/" className="nav-link">
          🔍 Search
        </Link>
        <Link to="/upload" className="nav-link">
          📤 Upload Transcript
        </Link>
        <Link to="/manual" className="nav-link">
          📎 Manual Ingest
        </Link>
      </nav>

      <main>{children}</main>

      <footer className="footer">
        Built with ❤️ using OpenAI + Gemini + pgvector + React + Node.js
      </footer>
    </div>
  );
}

export default Layout;
