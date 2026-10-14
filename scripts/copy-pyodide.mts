// Copies the Pyodide runtime from node_modules into public/pyodide so the
// browser loads it from this site (no third-party CDN). Runs before dev/build.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const source = join("node_modules", "pyodide");
const target = join("public", "pyodide");
const FILES = [
  "pyodide.mjs",
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

const { version } = JSON.parse(
  readFileSync(join(source, "package.json"), "utf8"),
) as { version: string };
mkdirSync(target, { recursive: true });
for (const file of FILES) copyFileSync(join(source, file), join(target, file));
writeFileSync(
  join(target, "VERSION"),
  `pyodide ${version} (MPL-2.0), copied from node_modules by scripts/copy-pyodide.mts\n`,
);
console.log(`pyodide ${version} copied to ${target}`);
