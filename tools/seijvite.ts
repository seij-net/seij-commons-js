/// <reference types='vitest' />
import react from "@vitejs/plugin-react";
import { builtinModules } from "module";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, PluginOption, UserConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export function externalFrom(pkgDir: string) {
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8"));
  const deps = Object.keys(pkg.dependencies ?? {}).concat(Object.keys(pkg.peerDependencies ?? {}));
  return (id: string) => {
    if (id.startsWith(".") || id.startsWith("/")) return false; // importe relatif = jamais external
    return (
      id.startsWith("node:") ||
      builtinModules.includes(id) ||
      id.startsWith("@seij/") ||
      deps.some((d) => id === d || id.startsWith(d + "/"))
    );
  };
}

export function makeConfig(options: {
  projectRoot: string; // ex: __dirname in the package
  type: "lib" | "lib-ui";
  entry?: string; // ex: "src/index.ts"
  outDir?: string; // ex: "dist"
  tsconfigLib?: string; // ex: "./tsconfig.lib.json"
  otherEntries?: Record<string, string>;
}) {
  const { type, projectRoot, entry = "src/index.ts", outDir = "dist", tsconfigLib = "./tsconfig.lib.json" } = options;

  const plugins: PluginOption[] = [];
  if (type === "lib-ui") plugins.push(react());
  plugins.push(tsconfigPaths());
  plugins.push(
    dts({
      entryRoot: "src",
      tsconfigPath: tsconfigLib,
      outDir: outDir,
      // Keep @seij/* imports as package specifiers in generated .d.ts
      aliasesExclude: [/^@seij\//],
    }),
  );

  const base: UserConfig = {
    plugins: plugins,

    build: {
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: {
          index: "src/index.ts",
          ...options.otherEntries,
        },
        // Change this to the formats you want to support.
        // Don't forget to update your package.json as well.
        formats: ["es"],
      },
      emitAssets: true,
      assetsInlineLimit: 1024, // toujours émettre un fichier
      outDir: outDir,
      sourcemap: true,
      rollupOptions: {
        // External packages that should not be bundled into your library.
        external: externalFrom(projectRoot),
        output: {
          // Tells rollup to create one .js file for each found module
          preserveModules: true,
          // In dist/ preserves hierarchy, so we can keep src/ hierarchy as-is
          preserveModulesRoot: path.join(projectRoot, "src"),
          // Keep readable file names (otherwise Rollup will add hash everywhere)
          entryFileNames: "[name].js",
          // Name of final assets filename for CDN builds
          assetFileNames: "assets/[name]-[hash][extname]",
          chunkFileNames: "chunks/[name]-[hash].js",
        },
        /*output: {
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
        },
        */
      },
    },
    test: {
      watch: false,
      globals: true,
      environment: type === "lib-ui" ? "jsdom" : "node",
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        provider: "v8",
      },
    },
  };
  return defineConfig(base);
}
