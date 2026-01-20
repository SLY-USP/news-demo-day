import axios from "axios";

export const handler = async (event, context) => {
  // 1. Get query params from the event object
  const { category, page, pageSize } = event.queryStringParameters;

  // 2. Get API Key from process.env (Standard in Node)
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

    // 3. Return response in Netlify format
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
