import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const DIST_DIR = "./dist";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

rmSync(DIST_DIR, { recursive: true, force: true });

const result = await Bun.build({
  entrypoints: [
    "./src/interface/chrome/service-worker.ts",
    "./src/interface/ui/popup.tsx",
    "./src/interface/ui/app.tsx",
    "./src/interface/ui/options.tsx",
  ],
  outdir: DIST_DIR,
  target: "browser",
  format: "esm",
  minify: IS_PRODUCTION,
  sourcemap: IS_PRODUCTION ? "none" : "inline",
  naming: "[name].[ext]",
});

if (!result.success) {
  console.error("Build failed:");
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

cpSync("./public", DIST_DIR, { recursive: true });

const htmlFiles = [
  "src/interface/ui/popup.html",
  "src/interface/ui/app.html",
  "src/interface/ui/options.html",
];

for (const htmlFile of htmlFiles) {
  if (existsSync(htmlFile)) {
    cpSync(htmlFile, path.join(DIST_DIR, path.basename(htmlFile)));
  }
}

const cssFile = "src/interface/ui/styles.css";
if (existsSync(cssFile)) {
  cpSync(cssFile, path.join(DIST_DIR, "styles.css"));
}

console.log(
  "Build complete:",
  result.outputs.map((o) => o.path),
);
