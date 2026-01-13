import { defineConfig, loadEnv } from "vite"; // Import loadEnv
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: "https://newsapi.org/v2",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/news/, "/top-headlines"),
          // Add this to automatically append the API Key locally
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.path += `&apiKey=${env.VITE_NEWS_API_KEY}`;
            });
          },
        },
      },
    },
  };
});