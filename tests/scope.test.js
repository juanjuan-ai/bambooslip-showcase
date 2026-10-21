"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const scripts = ["app.js", "model.js"].map(file => fs.readFileSync(path.join(root, file), "utf8")).join("\n");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("all runtime resource references are local and exist", () => {
  const sources = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]).filter(url => !url.startsWith("#"));
  for (const source of sources) {
    assert.ok(!/^(?:[a-z]+:)?\/\//i.test(source));
    assert.ok(fs.existsSync(path.join(root, source)), `Missing local asset: ${source}`);
  }
  assert.doesNotMatch(css, /@import|url\s*\(/i);
});
test("runtime has no uploads, network request APIs or persistent storage", () => {
  assert.doesNotMatch(html, /type=["']file["']|<form\b|<iframe\b/i);
  assert.doesNotMatch(scripts, /\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage|sessionStorage|indexedDB|showDirectoryPicker|showOpenFilePicker)\b/);
  assert.doesNotMatch(scripts, /\b(?:eval|Function)\s*\(/);
});
test("targeted credential-pattern scan and boundary disclosures", () => {
  const source = `${html}\n${scripts}\n${css}`;
  assert.doesNotMatch(source, /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|sk-proj-[A-Za-z0-9_-]{20,}/);
  assert.match(html, /original business source/i);
  assert.match(html, /not a production implementation/i);
  assert.match(html, /fictional/i);
});
