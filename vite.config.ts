import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_PROXY_TARGET;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      port: 5173,
      proxy: proxyTarget
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              configure: (proxy) => {
                proxy.on("proxyReq", (proxyReq) => {
                  proxyReq.setHeader("origin", proxyTarget);
                  proxyReq.setHeader("referer", `${proxyTarget}/`);
                });
              },
            },
          }
        : undefined,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": [
              "react",
              "react-dom",
              "react-router",
              "@tanstack/react-query",
            ],
            "refine-vendor": [
              "@refinedev/core",
              "@refinedev/react-router",
              "@refinedev/react-table",
              "@refinedev/react-hook-form",
              "@tanstack/react-table",
            ],
            "ui-vendor": [
              "radix-ui",
              "lucide-react",
              "class-variance-authority",
              "clsx",
              "tailwind-merge",
              "cn",
              "sonner",
            ],
            "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
            "charts-vendor": ["recharts"],
          },
        },
      },
    },
  };
});
