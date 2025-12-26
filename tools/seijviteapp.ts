/// <reference types='vitest' />
import react from "@vitejs/plugin-react";
import { CommonServerOptions, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export function makeConfig(props: {
  root: string;
  server: {
    port: number;
    proxy: CommonServerOptions["proxy"];
  };
  preview: {
    port: number;
    proxy: CommonServerOptions["proxy"];
  };
}) {
  return defineConfig({
    root: props.root,
    server: {
      port: props.server.port,
      host: "localhost",
      proxy: props.server.proxy,
    },
    preview: {
      port: props.preview.port,
      host: "localhost",
      proxy: props.preview.proxy,
    },
    plugins: [
      react(),
      tsconfigPaths(),
      visualizer({ filename: "dist/stats/index.html", gzipSize: true, brotliSize: true }),
    ],
    build: {
      outDir: "dist",
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    test: {
      watch: false,
      globals: true,
      environment: "jsdom",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        provider: "v8",
      },
    },
  });
}
