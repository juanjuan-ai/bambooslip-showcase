(function () {
  "use strict";
  const M = window.ShowcaseModel;
  let state = M.createState();
  let selectedEngineering = state.engineering[0].id;
  let selectedVideo = state.video[0].id;
  let videoStage = "all";
  let toastTimer;
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const number = value => new Intl.NumberFormat("en-US").format(value);
  const money = value => `¥${number(value)}`;
  const compactMoney = value => value >= 1000000 ? `¥${(value / 1000000).toFixed(2)}<small>m</small>` : `¥${(value / 1000).toFixed(0)}<small>k</small>`;
  function badge(status) {
    const color = { "Needs review": "amber", "Settled": "gray", "筹备": "gray", "制作中": "blue", "待审片": "amber", "修改中": "purple", "已交付": "" }[status] || "";
    return `<span class="status-badge ${color}">${escape(status)}</span>`;
  }
  function metric(label, value, note, icon) {
    return `<article class="metric"><div class="metric-top"><span>${label}</span><span class="metric-icon" aria-hidden="true">${icon}</span></div><div class="metric-number">${value}</div><p class="metric-note">${note}</p></article>`;
  }
  function toast(message) {
    clearTimeout(toastTimer);
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("visible");
    toastTimer = setTimeout(() => node.classList.remove("visible"), 3500);
  }
  function renderEngineering() {
    const stats = M.engineeringSummary(state);
    $("#engineering-metrics").innerHTML = metric("Portfolio projects", stats.projects, `<b>${stats.active} active</b> · 1 settled in sample`, "▦") + metric("Total contract value", compactMoney(stats.value), "Fictional amounts · CNY", "↗") + metric("Pending approvals", stats.pending, "Simulate approval below", "◷") + metric("Settlement to review", compactMoney(stats.settlement), "Fictional pending settlement · CNY", "≋");
    $("#project-progress").innerHTML = state.engineering.slice(0, 4).map(p => `<div class="chart-row"><span class="chart-name">${escape(p.name)}</span><div class="chart-track" role="meter" aria-label="${escape(p.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${p.progress}"><div class="chart-bar" style="width:${p.progress}%"></div></div><span class="chart-value">${p.progress}%</span></div>`).join("");
    const queue = state.engineering.filter(p => p.pending);
    $("#approval-queue").innerHTML = queue.length ? queue.map((p, i) => `<div class="queue-item"><span class="queue-index">0${i + 1}</span><div class="queue-copy"><p class="queue-title">${escape(p.name)}</p><p class="queue-subtitle">${escape(p.contract)} · Settlement review</p></div><span class="queue-amount">${money(p.settlement)}</span></div>`).join("") : '<p class="queue-empty">All sample approvals are complete.</p>';
    renderEngineeringList();
    renderContract();
  }
  function renderEngineeringList() {
    const rows = M.filterEngineering(state, $("#engineering-search").value, $("#engineering-filter").value);
    $("#engineering-count").textContent = `${rows.length} of ${state.engineering.length} projects`;
    $("#engineering-empty").hidden = rows.length > 0;
    $("#engineering-rows").innerHTML = rows.map(p => `<tr class="project-row ${p.id === selectedEngineering ? "selected" : ""}"><td><div class="project-title">${escape(p.name)}</div><span class="project-id">${escape(p.contract)}</span></td><td>${badge(p.status)}</td><td class="amount-cell">${money(p.amount)}</td><td><button type="button" class="open-project" data-project="${p.id}" aria-label="Open ${escape(p.name)} contract" aria-pressed="${p.id === selectedEngineering}">↗</button></td></tr>`).join("");
  }
  function renderContract() {
    const p = state.engineering.find(item => item.id === selectedEngineering);
    const buttonLabel = p.pending ? "Simulate approval" : (p.timeline.some(t => t.label === "Demo approval recorded") ? "Demo approval recorded ✓" : "No pending approval");
    $("#contract-details").innerHTML = `<div class="detail-top"><p class="eyebrow">SELECTED CONTRACT</p>${badge(p.status)}</div><h2>${escape(p.name)}</h2><p class="detail-meta">${escape(p.contract)} · ${escape(p.category)}</p><dl class="detail-values"><div><dt>Contract value · demo CNY</dt><dd>${money(p.amount)}</dd></div><div><dt>Settlement to review</dt><dd>${money(p.settlement)}</dd></div></dl><h3 class="timeline-label">Approval timeline</h3><ol class="timeline">${p.timeline.map(t => `<li><strong>${escape(t.label)}</strong><small>${escape(t.time)}</small></li>`).join("")}</ol><button type="button" class="button button-primary button-full" id="approve-contract" ${p.pending ? "" : "disabled"}>${buttonLabel}</button><p class="simulation-note">Demo action only. No real approval or payment occurs.</p>`;
  }
  function renderVideo() {
    const stats = M.videoSummary(state);
    $("#video-metrics").innerHTML = metric("Productions", stats.projects, `<b>${stats.active} in progress</b> · Sample projects`, "▷") + metric("Waiting for review", stats.review, "Current stage · 待审片", "◷") + metric("Tasks complete", `${stats.tasksDone}<small>/ ${stats.tasksTotal}</small>`, "Toggle a task to update progress", "✓") + metric("File versions", stats.versions, "Metadata only · No actual media", "▤");
    $("#stage-filters").innerHTML = ["all", ...M.stages].map(stage => `<button type="button" class="stage-tab ${stage === videoStage ? "active" : ""}" data-stage="${stage}" aria-pressed="${stage === videoStage}" title="${stage === "all" ? "All stages" : M.stageLabels[stage]}">${stage === "all" ? "All stages" : stage}</button>`).join("");
    renderVideoList();
    renderVideoDetail();
  }
  function renderVideoList() {
    const projects = M.filterVideo(state, $("#video-search").value, videoStage);
    $("#video-count").textContent = `${projects.length} of ${state.video.length} projects`;
    $("#video-empty").hidden = projects.length > 0;
    $("#video-projects").innerHTML = projects.map(p => {
      const done = p.tasks.filter(t => t.done).length;
      const percent = Math.round(done / p.tasks.length * 100);
      const poster = state.video.indexOf(p) + 1;
      return `<article class="production-card ${p.id === selectedVideo ? "selected" : ""}"><div class="project-poster poster-${poster}" aria-hidden="true"><span class="poster-type">${escape(p.category)}</span><span class="poster-word">${escape(p.poster)}</span><span class="poster-duration">${p.duration}</span></div><div class="production-card-body"><div class="production-card-heading"><h3>${escape(p.name)}</h3>${badge(p.stage)}</div><p class="subcopy">${escape(p.format)}</p><div class="task-progress"><span>${done} of ${p.tasks.length} tasks complete</span><span>${percent}%</span></div><div class="mini-track" role="meter" aria-label="${escape(p.name)} task completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div><div class="card-footer"><span>${p.versions.length} synthetic versions</span><button type="button" data-video="${p.id}" aria-label="Open ${escape(p.name)} production" aria-pressed="${p.id === selectedVideo}">Open workspace ↗</button></div></div></article>`;
    }).join("");
  }
  function renderVideoDetail() {
    const p = state.video.find(item => item.id === selectedVideo);
    const done = p.tasks.filter(t => t.done).length;
    $("#video-details").innerHTML = `<div class="detail-top"><p class="eyebrow">SELECTED PRODUCTION</p>${badge(p.stage)}</div><h2>${escape(p.name)}</h2><p class="detail-meta">${escape(p.id)} · ${escape(p.format)}<br>Fictional project · Memory-only changes</p><label class="stage-select-label" for="video-stage">Production stage · 制作阶段</label><select id="video-stage">${M.stages.map(stage => `<option value="${stage}" ${stage === p.stage ? "selected" : ""}>${stage} · ${M.stageLabels[stage]}</option>`).join("")}</select><div class="detail-section"><div class="detail-section-heading"><h3>Task checklist</h3><span>${done} / ${p.tasks.length} complete</span></div><div class="task-list">${p.tasks.map((task, i) => `<label class="task-item ${task.done ? "done" : ""}"><input type="checkbox" data-task="${i}" ${task.done ? "checked" : ""}><span>${escape(task.title)}</span></label>`).join("")}</div></div><div class="detail-section"><div class="detail-section-heading"><h3>Versions & deliverable</h3><span>${p.versions.length} versions</span></div><p class="file-note">Synthetic inventory only. These entries do not contain playable or downloadable files.</p>${p.versions.map(file => `<div class="file-row ${file.id === p.pinned ? "pinned" : ""}"><span class="file-icon" aria-hidden="true">▷</span><div class="file-copy"><p class="file-name">${escape(file.name)}</p><p class="file-meta">${escape(file.size)} · ${escape(file.note)}</p></div><button type="button" class="pin-button" data-pin="${file.id}" aria-label="${file.id === p.pinned ? "Current deliverable: " : "Pin as current deliverable: "}${escape(file.name)}" aria-pressed="${file.id === p.pinned}">${file.id === p.pinned ? "Current ✓" : "Pin"}</button></div>`).join("")}<p class="deliverable-note"><span aria-hidden="true">◎</span><span>Pin a version to mark the current deliverable for this demo session.</span></p></div>`;
  }
  function setView() {
    const hash = window.location.hash.slice(1);
    const view = ["engineering", "video", "about"].includes(hash) ? hash : "engineering";
    document.querySelectorAll(".view").forEach(node => { node.hidden = node.id !== `${view}-view`; });
    document.querySelectorAll("[data-view]").forEach(node => {
      const active = node.dataset.view === view;
      node.classList.toggle("active", active);
      if (active) node.setAttribute("aria-current", "page"); else node.removeAttribute("aria-current");
    });
    const title = { engineering: "Engineering operations", video: "Video production", about: "About this showcase" }[view];
    $("#breadcrumb-current").textContent = title;
    document.title = `${title} · BambooSlip`;
  }
  $(".skip-link").addEventListener("click", event => {
    event.preventDefault();
    $("#main").focus();
  });
  $("#engineering-search").addEventListener("input", renderEngineeringList);
  $("#engineering-filter").addEventListener("change", renderEngineeringList);
  $("#engineering-rows").addEventListener("click", event => {
    const button = event.target.closest("[data-project]");
    if (!button) return;
    selectedEngineering = button.dataset.project;
    renderEngineeringList();
    renderContract();
    $(`[data-project="${selectedEngineering}"]`)?.focus({ preventScroll: true });
  });
  $("#contract-details").addEventListener("click", event => {
    if (!event.target.closest("#approve-contract")) return;
    if (M.approveContract(state, selectedEngineering)) {
      renderEngineering();
      toast("Demo approval recorded. No real approval or payment occurred.");
    }
  });
  $("#video-search").addEventListener("input", renderVideoList);
  $("#stage-filters").addEventListener("click", event => {
    const button = event.target.closest("[data-stage]");
    if (!button) return;
    videoStage = button.dataset.stage;
    renderVideo();
    $(`[data-stage="${videoStage}"]`)?.focus({ preventScroll: true });
  });
  $("#video-projects").addEventListener("click", event => {
    const button = event.target.closest("[data-video]");
    if (!button) return;
    selectedVideo = button.dataset.video;
    renderVideoList();
    renderVideoDetail();
    $(`[data-video="${selectedVideo}"]`)?.focus({ preventScroll: true });
  });
  $("#video-details").addEventListener("change", event => {
    if (event.target.matches("[data-task]")) {
      const index = Number(event.target.dataset.task);
      M.toggleTask(state, selectedVideo, index);
      renderVideo();
      $(`[data-task="${index}"]`)?.focus({ preventScroll: true });
      toast("Sample task updated for this session.");
    } else if (event.target.matches("#video-stage")) {
      M.setStage(state, selectedVideo, event.target.value);
      renderVideo();
      $("#video-stage").focus({ preventScroll: true });
      toast("Demo production stage updated.");
    }
  });
  $("#video-details").addEventListener("click", event => {
    const button = event.target.closest("[data-pin]");
    if (!button) return;
    M.pinVersion(state, selectedVideo, button.dataset.pin);
    const version = button.dataset.pin;
    renderVideoDetail();
    $(`[data-pin="${version}"]`)?.focus({ preventScroll: true });
    toast("Current deliverable updated in the synthetic inventory.");
  });
  $("#reset-demo").addEventListener("click", () => {
    state = M.createState();
    selectedEngineering = state.engineering[0].id;
    selectedVideo = state.video[0].id;
    videoStage = "all";
    $("#engineering-search").value = "";
    $("#engineering-filter").value = "all";
    $("#video-search").value = "";
    renderEngineering();
    renderVideo();
    toast("Demo reset. All fictional data restored.");
  });
  window.addEventListener("hashchange", setView);
  renderEngineering();
  renderVideo();
  setView();
})();
