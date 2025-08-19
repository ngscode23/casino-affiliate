// scripts/find-missing-deps.mjs
import fs from "fs";
import path from "path";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const have = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
]);

const missing = new Set();
const exts = [".ts", ".tsx", ".js", ".jsx"];
const importRe = /from\s+["']([^"']+)["']|require\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (exts.some((e) => p.endsWith(e))) {
      const s = fs.readFileSync(p, "utf8");
      for (const m of s.matchAll(importRe)) {
        const id = m[1] || m[2] || m[3];
        if (!id) continue;
        if (id.startsWith(".") || id.startsWith("/") || id.startsWith("node:")) continue;
        // отсечь типовые виртуальные/внутренние импорты vite
        if (id.startsWith("virtual:") || id.startsWith("vite/")) continue;
        if (!have.has(id)) missing.add(id);
      }
    }
  }
}

if (fs.existsSync("src")) walk("src");
console.log([...missing]);