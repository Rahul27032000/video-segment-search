import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import SearchPage from "./SearchPage";
import TranscriptUpload from "./TranscriptUpload";
import ManualIngestPage from "./ManualIngestPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><SearchPage /></Layout>} />
        <Route path="/upload" element={<Layout><TranscriptUpload /></Layout>} />
        <Route path="/manual" element={<Layout><ManualIngestPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;