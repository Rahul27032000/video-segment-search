import { Router } from 'express';
import { searchBestChunk } from '../services/searchService.js';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'Missing q param' });
    const result = await searchBestChunk(q);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
