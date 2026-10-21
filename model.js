/* Newly authored fictional demo data and memory-only state transitions. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ShowcaseModel = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const stages = ["筹备", "制作中", "待审片", "修改中", "已交付"];
  const stageLabels = { "筹备": "Planning", "制作中": "In production", "待审片": "In review", "修改中": "Revisions", "已交付": "Delivered" };
  function createState() {
    return {
      engineering: [
        { id: "ENG-101", name: "Cedar Pavilion", contract: "DEMO-C-001", status: "Needs review", amount: 480000, progress: 68, category: "Public space", settlement: 180000, pending: true, timeline: [{ label: "Contract drafted", time: "Demo day 01 · 09:00" }, { label: "Scope review complete", time: "Demo day 03 · 14:30" }, { label: "Settlement submitted", time: "Demo day 05 · 10:15" }] },
        { id: "ENG-102", name: "Willow Learning Hub", contract: "DEMO-C-002", status: "On track", amount: 620000, progress: 42, category: "Learning space", settlement: 0, pending: false, timeline: [{ label: "Contract drafted", time: "Demo day 01 · 11:00" }, { label: "Contract approved", time: "Demo day 02 · 15:00" }, { label: "Milestone in progress", time: "Demo day 04 · 09:30" }] },
        { id: "ENG-103", name: "Juniper Walkway", contract: "DEMO-C-003", status: "Needs review", amount: 350000, progress: 85, category: "Landscape", settlement: 90000, pending: true, timeline: [{ label: "Contract drafted", time: "Demo day 01 · 10:00" }, { label: "Milestone review complete", time: "Demo day 04 · 13:00" }, { label: "Settlement submitted", time: "Demo day 06 · 16:20" }] },
        { id: "ENG-104", name: "Maple Reading Room", contract: "DEMO-C-004", status: "On track", amount: 290000, progress: 26, category: "Interior fit-out", settlement: 0, pending: false, timeline: [{ label: "Contract drafted", time: "Demo day 02 · 09:00" }, { label: "Contract approved", time: "Demo day 03 · 11:30" }, { label: "Milestone in progress", time: "Demo day 05 · 14:00" }] },
        { id: "ENG-105", name: "Fern Studio", contract: "DEMO-C-005", status: "Settled", amount: 410000, progress: 100, category: "Creative space", settlement: 0, pending: false, timeline: [{ label: "Contract approved", time: "Demo day 01 · 12:00" }, { label: "Final review complete", time: "Demo day 06 · 10:00" }, { label: "Settlement recorded", time: "Demo day 07 · 15:30" }] },
        { id: "ENG-106", name: "Birch Workshop", contract: "DEMO-C-006", status: "Needs review", amount: 330000, progress: 57, category: "Workshop space", settlement: 120000, pending: true, timeline: [{ label: "Contract drafted", time: "Demo day 02 · 14:00" }, { label: "Scope review complete", time: "Demo day 04 · 10:00" }, { label: "Settlement submitted", time: "Demo day 07 · 09:15" }] }
      ],
      video: [
        { id: "VID-101", name: "A quieter morning", poster: "Slow living", category: "LIFESTYLE FILM", duration: "01:30", stage: "待审片", format: "Brand film · 16:9", tasks: [{ title: "Storyboard approved", done: true }, { title: "Picture edit complete", done: true }, { title: "Sound mix reviewed", done: true }, { title: "Final review complete", done: false }], versions: [{ id: "v1", name: "morning_cut_v01.mp4", size: "128 MB", note: "Assembly · synthetic" }, { id: "v2", name: "morning_cut_v02.mp4", size: "142 MB", note: "Picture edit · synthetic" }, { id: "v3", name: "morning_review_v03.mp4", size: "156 MB", note: "Review version · synthetic" }], pinned: "v3" },
        { id: "VID-102", name: "Made of light", poster: "Golden hour", category: "PRODUCT STORY", duration: "00:45", stage: "制作中", format: "Product film · 4:5", tasks: [{ title: "Visual direction approved", done: true }, { title: "Shot list prepared", done: true }, { title: "Picture edit complete", done: false }, { title: "Final review complete", done: false }], versions: [{ id: "v1", name: "light_assembly_v01.mp4", size: "64 MB", note: "Assembly · synthetic" }, { id: "v2", name: "light_edit_v02.mp4", size: "78 MB", note: "Work in progress · synthetic" }], pinned: "v1" },
        { id: "VID-103", name: "City in motion", poster: "Between places", category: "SHORT DOCUMENTARY", duration: "03:00", stage: "修改中", format: "Short film · 16:9", tasks: [{ title: "Story outline approved", done: true }, { title: "Interview edit complete", done: true }, { title: "Review notes addressed", done: false }, { title: "Delivery check complete", done: false }], versions: [{ id: "v1", name: "city_cut_v01.mp4", size: "224 MB", note: "First cut · synthetic" }, { id: "v2", name: "city_review_v02.mp4", size: "256 MB", note: "Review version · synthetic" }], pinned: "v2" },
        { id: "VID-104", name: "Small wonders", poster: "Look closer", category: "SOCIAL SERIES", duration: "00:30", stage: "筹备", format: "Social short · 9:16", tasks: [{ title: "Brief reviewed", done: true }, { title: "Storyboard approved", done: false }, { title: "Picture edit complete", done: false }, { title: "Final review complete", done: false }], versions: [{ id: "v1", name: "wonders_animatic_v01.mp4", size: "32 MB", note: "Animatic · synthetic" }], pinned: "v1" },
        { id: "VID-105", name: "Objects & stories", poster: "Everyday forms", category: "DESIGN PORTRAIT", duration: "02:00", stage: "已交付", format: "Portrait film · 16:9", tasks: [{ title: "Story outline approved", done: true }, { title: "Picture edit complete", done: true }, { title: "Sound mix reviewed", done: true }, { title: "Delivery check complete", done: true }], versions: [{ id: "v1", name: "objects_review_v01.mp4", size: "180 MB", note: "Review version · synthetic" }, { id: "v2", name: "objects_delivery_v02.mp4", size: "210 MB", note: "Delivery version · synthetic" }], pinned: "v2" },
        { id: "VID-106", name: "An open trail", poster: "Find your way", category: "OUTDOOR FILM", duration: "01:00", stage: "制作中", format: "Campaign film · 16:9", tasks: [{ title: "Storyboard approved", done: true }, { title: "Footage selection complete", done: true }, { title: "Picture edit complete", done: false }, { title: "Final review complete", done: false }], versions: [{ id: "v1", name: "trail_assembly_v01.mp4", size: "96 MB", note: "Assembly · synthetic" }, { id: "v2", name: "trail_edit_v02.mp4", size: "110 MB", note: "Work in progress · synthetic" }], pinned: "v2" }
      ]
    };
  }
  function filterEngineering(state, query = "", status = "all") {
    const keyword = query.trim().toLowerCase();
    return state.engineering.filter(p => (!keyword || `${p.name} ${p.id} ${p.contract} ${p.category}`.toLowerCase().includes(keyword)) && (status === "all" || p.status === status));
  }
  function filterVideo(state, query = "", stage = "all") {
    const keyword = query.trim().toLowerCase();
    return state.video.filter(p => (!keyword || `${p.name} ${p.id} ${p.format} ${p.category}`.toLowerCase().includes(keyword)) && (stage === "all" || p.stage === stage));
  }
  function approveContract(state, id) {
    const project = state.engineering.find(p => p.id === id);
    if (!project || !project.pending) return false;
    project.pending = false;
    project.status = "On track";
    project.settlement = 0;
    project.timeline.push({ label: "Demo approval recorded", time: "This session · simulated action" });
    return true;
  }
  function setStage(state, id, stage) {
    const project = state.video.find(p => p.id === id);
    if (!project || !stages.includes(stage)) return false;
    project.stage = stage;
    return true;
  }
  function toggleTask(state, id, index) {
    const project = state.video.find(p => p.id === id);
    if (!project || !Number.isInteger(index) || !project.tasks[index]) return false;
    project.tasks[index].done = !project.tasks[index].done;
    return true;
  }
  function pinVersion(state, id, version) {
    const project = state.video.find(p => p.id === id);
    if (!project || !project.versions.some(v => v.id === version)) return false;
    project.pinned = version;
    return true;
  }
  function engineeringSummary(state) {
    return { projects: state.engineering.length, active: state.engineering.filter(p => p.status !== "Settled").length, value: state.engineering.reduce((sum, p) => sum + p.amount, 0), pending: state.engineering.filter(p => p.pending).length, settlement: state.engineering.reduce((sum, p) => sum + p.settlement, 0) };
  }
  function videoSummary(state) {
    return { projects: state.video.length, active: state.video.filter(p => p.stage !== "已交付").length, review: state.video.filter(p => p.stage === "待审片").length, tasksDone: state.video.flatMap(p => p.tasks).filter(t => t.done).length, tasksTotal: state.video.flatMap(p => p.tasks).length, versions: state.video.reduce((sum, p) => sum + p.versions.length, 0) };
  }
  return { createState, stages, stageLabels, filterEngineering, filterVideo, approveContract, setStage, toggleTask, pinVersion, engineeringSummary, videoSummary };
});
