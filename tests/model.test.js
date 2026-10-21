"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const M = require("../model.js");

test("each fresh snapshot is independent and starts with consistent totals", () => {
  const a = M.createState();
  const b = M.createState();
  assert.deepEqual(M.engineeringSummary(a), { projects: 6, active: 5, value: 2480000, pending: 3, settlement: 390000 });
  assert.deepEqual(M.videoSummary(a), { projects: 6, active: 5, review: 1, tasksDone: 14, tasksTotal: 24, versions: 12 });
  a.engineering[0].name = "Changed";
  assert.equal(b.engineering[0].name, "Cedar Pavilion");
});
test("engineering search is case-insensitive and combines with status filters", () => {
  const state = M.createState();
  assert.equal(M.filterEngineering(state, " CEDAR ").length, 1);
  assert.equal(M.filterEngineering(state, "DEMO-C-002")[0].name, "Willow Learning Hub");
  assert.equal(M.filterEngineering(state, "", "Needs review").length, 3);
  assert.equal(M.filterEngineering(state, "Cedar", "Settled").length, 0);
  assert.equal(M.filterEngineering(state, "<script>").length, 0);
});
test("simulated approval updates queue, settlement and timeline once", () => {
  const state = M.createState();
  assert.equal(M.approveContract(state, "ENG-101"), true);
  assert.equal(M.engineeringSummary(state).pending, 2);
  assert.equal(M.engineeringSummary(state).settlement, 210000);
  assert.equal(state.engineering[0].timeline.length, 4);
  assert.equal(state.engineering[0].status, "On track");
  assert.equal(M.approveContract(state, "ENG-101"), false);
  assert.equal(state.engineering[0].timeline.length, 4);
  assert.equal(M.approveContract(state, "missing"), false);
});
test("video search and stage filters return only matching sample projects", () => {
  const state = M.createState();
  assert.equal(M.filterVideo(state, "CITY")[0].id, "VID-103");
  assert.equal(M.filterVideo(state, "", "制作中").length, 2);
  assert.equal(M.filterVideo(state, "City", "筹备").length, 0);
  assert.equal(M.filterVideo(state, "VID-104")[0].name, "Small wonders");
});
test("task toggles are reversible and invalid changes are rejected", () => {
  const state = M.createState();
  assert.equal(M.toggleTask(state, "VID-101", 3), true);
  assert.equal(M.videoSummary(state).tasksDone, 15);
  assert.equal(M.toggleTask(state, "VID-101", 3), true);
  assert.equal(M.videoSummary(state).tasksDone, 14);
  assert.equal(M.toggleTask(state, "missing", 0), false);
  assert.equal(M.toggleTask(state, "VID-101", -1), false);
  assert.equal(M.toggleTask(state, "VID-101", 1.2), false);
});
test("only known stages can be selected", () => {
  const state = M.createState();
  assert.equal(M.setStage(state, "VID-101", "已交付"), true);
  assert.equal(M.videoSummary(state).review, 0);
  assert.equal(M.videoSummary(state).active, 4);
  assert.equal(M.setStage(state, "VID-101", "invalid"), false);
  assert.equal(M.setStage(state, "missing", "筹备"), false);
});
test("only a version belonging to the project can be pinned", () => {
  const state = M.createState();
  assert.equal(M.pinVersion(state, "VID-101", "v1"), true);
  assert.equal(state.video[0].pinned, "v1");
  assert.equal(M.pinVersion(state, "VID-104", "v3"), false);
  assert.equal(M.pinVersion(state, "missing", "v1"), false);
});
test("seed data has unique identifiers and valid progress and pinned versions", () => {
  const state = M.createState();
  assert.equal(new Set(state.engineering.map(p => p.id)).size, state.engineering.length);
  assert.equal(new Set(state.video.map(p => p.id)).size, state.video.length);
  for (const p of state.engineering) assert.ok(p.progress >= 0 && p.progress <= 100);
  for (const p of state.video) {
    assert.ok(M.stages.includes(p.stage));
    assert.ok(p.versions.some(v => v.id === p.pinned));
  }
});
