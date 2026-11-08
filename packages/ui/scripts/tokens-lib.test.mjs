import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { renderTokens } from "./tokens-lib.mjs";

test("resolves references to existing tokens", () => {
  const result = renderTokens({ color: { ink: { 900: "#111" } }, semantic: { text: "{color.ink.900}" } });
  assert.deepEqual(result.ok && result.css.split("\n").slice(2, 4), [
    "  --rb-color-ink-900: #111;",
    "  --rb-semantic-text: var(--rb-color-ink-900);",
  ]);
});

test("reports every unknown reference with its token", () => {
  const result = renderTokens({
    color: { ink: { 900: "#111" } },
    semantic: { text: "{color.ink.950}", border: "1px solid {color.slate.200}" },
  });
  assert.deepEqual(result, {
    ok: false,
    errors: [
      { token: "semantic.text", ref: "color.ink.950" },
      { token: "semantic.border", ref: "color.slate.200" },
    ],
  });
});

test("a reference to a group, not a leaf, is unknown", () => {
  const result = renderTokens({ color: { ink: { 900: "#111" } }, semantic: { text: "{color.ink}" } });
  assert.equal(result.ok, false);
});

test("the real tokens.json renders to the committed tokens.css", () => {
  const tokens = JSON.parse(readFileSync(new URL("../src/tokens/tokens.json", import.meta.url), "utf8"));
  const committed = readFileSync(new URL("../src/tokens/tokens.css", import.meta.url), "utf8");
  const result = renderTokens(tokens);
  assert.equal(result.ok && result.css, committed);
});
