import axios from "axios";

// 1. Look for the Vercel variable first.
// 2. If it's missing (like on your laptop), fall back to localhost.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const get = async (path: string): Promise<unknown> => {
  // Note: We remove the trailing slash from BASE_URL if it exists to avoid double slashes
  const cleanBaseUrl = BASE_URL.replace(/\/$/, "");
  return await axios.get(`${cleanBaseUrl}/api/${path}`);
};
