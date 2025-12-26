// eslint.config.js
import { defineConfig } from "eslint/config";
import { makeConfig } from '../../eslint.config.mjs';

export default defineConfig(makeConfig({ react: true }));
