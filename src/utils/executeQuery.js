import pool from "../config/dbConfig.js";

export const executeQuery = async (query) => {
    let client
  try {
    client = await pool.connect();
    const result = await client.query(query);
    return result;
  } finally {
    if (client) {
      client.release();
    }
  }
};
