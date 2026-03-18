// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

const isVercel = !!process.env.VERCEL;

let adapter;
if (isVercel) {
  const { default: vercel } = await import("@astrojs/vercel");
  adapter = vercel();
} else {
  const { default: node } = await import("@astrojs/node");
  adapter = node({ mode: "standalone" });
}

export default defineConfig({
  output: "server",
  adapter,
  integrations: [
    tailwind(),
    react(),
  ],
  vite: {
    cacheDir: 'node_modules/.cache/.vite',
    optimizeDeps: {
      include: ['react', 'react-dom', 'zustand'],
    },
  },
});
