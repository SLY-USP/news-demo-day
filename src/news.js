import axios from "axios";

export default async function handler(req, res) {
  // 1. Get query params from the frontend request
  const { category, page, pageSize } = req.query;
  
  // 2. Use your API Key (We'll set this in Vercel dashboard later)
  const API_KEY = process.env.VITE_NEWS_API_KEY;

  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country: "us",
        category: category || "general",
        page: page || 1,
        pageSize: pageSize || 20,
        apiKey: API_KEY,
      },
    });

    // 3. Send the data back to your React app
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
}