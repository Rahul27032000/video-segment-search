# 🎥 Video Query Matcher

A fast and scalable backend microservice that maps user questions to the most relevant **video segment** (video + timestamp) using **OpenAI embeddings**, **pgvector**, and **semantic search**.

---

## 🚀 Features

- ✅ Transcribes and chunks video transcripts
- ✅ Embeds transcript chunks using OpenAI's `text-embedding-3-small`
- ✅ Stores vector embeddings in PostgreSQL via `pgvector`
- ✅ Performs fast semantic similarity search
- ✅ Returns best-matched `video_id` and `timestamp` in <1s
- ✅ Built with clean, modular Node.js (ESM) structure

---

## 📦 Tech Stack

- **Node.js (ES Modules)**
- **PostgreSQL + pgvector**
- **OpenAI API (Embeddings)**
- **Express.js**
- **Morgan for logging**

