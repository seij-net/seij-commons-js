/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { builtinModules } from "module";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, PluginOption, UserConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

/**
 *
 * Returns a resolver that tells Vite if an import is external (not meant to
 * be bundled) or bundled into resulting archive.
 *
 * Given a moduleRoot (lib/common-ui for example) reads its package.json and
 * gets the list of dependencies and deepDependencies.
 *
 * Then build the resolver, that will take an import (id) and tells:
 * - if import is relative (./, ??., /) this is never an external module
 * - if import is node: or is a builting nodejs module, will be always external
 * - if import is @seij/xxx, will be external too
 * - if import is a deps or peerDeps, will be external too
 *
 * When bundling, external dependencies will not be bundled.
 *
 * This seems counter intuitive, but Vite main goal is to bundle everything
 * (think about a web app, not a lib). So we need to tell him to exclude
 * everything that is not ours.
 *
 * @param moduleRoot lib/common-ui for example
 * @returns a resolver function
 */
export function externalFrom(moduleRoot: string): (id: string) => boolean {
  const pkg = JSON.parse(fs.readFileSync(path.join(moduleRoot, "package.json"), "utf8"));
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

/**
 * Options available for making a common vite configuration for all our libs
 */
interface MakeConfigOptions {
  /**
   * Module (library) root directory.
   * You can use __dirname in the package
   */
  projectRoot: string;
  /**
   * "lib" = no Vite's React plugin, test environment = node
   * "lib-ui" = includes Vite React plugin, test environment = jsdom
   */
  type: "lib" | "lib-ui";

  /**
   * Other entries to add (for example common-ui adds src/styles.ts)
   */
  otherEntries?: Record<string, string>;
}

/**
 * Function to call from each lib/ to build a Vite configuration.
 * This aims at industrializing how we build libraries.
 *
 * @param options options to configure library build behaviour
 * @returns Vite configuration
 */
export function makeConfig(options: MakeConfigOptions) {
  const { type, projectRoot } = options;

  const entry = "src/index.ts";
  const outDir = "dist";
  const tsconfigLib = "./tsconfig.lib.json";

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
