import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_REACT_APP_API_URL,
        changeOrigin: true,
        rewrite: (path) => {
          let p = path.replace(/^\/api/, "");
          console.log("sta je", process.env.VITE_REACT_APP_API_URL);
          return p;
        },
      },
    },
  },
});
