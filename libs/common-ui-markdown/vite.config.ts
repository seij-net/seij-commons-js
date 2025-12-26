/// <reference types="vitest" />
import { makeConfig } from "../../tools/seijvite";

export default makeConfig({
  projectRoot: __dirname,
  type: "lib",
  otherEntries: {
    styles: "src/styles.ts",
  },
});
