// Generates src/tokens/tokens.css from src/tokens/tokens.json (see tokens-lib.mjs).
// Exits non-zero, writing nothing, if any "{ref}" names a token that doesn't exist.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { renderTokens } from "./tokens-lib.mjs";

const dir = new URL("../src/tokens/", import.meta.url);
const result = renderTokens(JSON.parse(readFileSync(new URL("tokens.json", dir), "utf8")));

if (!result.ok) {
  console.error(`tokens.json has ${result.errors.length} unresolved reference(s):`);
  for (const { token, ref } of result.errors) console.error(`  ${token} -> {${ref}} (no such token)`);
  process.exit(1);
}
writeFileSync(fileURLToPath(new URL("tokens.css", dir)), result.css);
console.log(`tokens.css: ${result.count} variables`);
