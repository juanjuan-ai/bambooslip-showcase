/* Optional browser QA: requires Playwright and an installed Chromium binary.
   Neither is a runtime dependency of the demo. */
"use strict";
const { chromium } = require("playwright");
const { pathToFileURL } = require("node:url");
const path = require("node:path");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const root = path.resolve(__dirname, "..");
const url = pathToFileURL(path.join(root, "index.html")).href;
const output = path.join(root, "screenshots");
fs.mkdirSync(output, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1150 }, deviceScaleFactor: 1 });
    const errors = [];
    const network = [];
    page.on("pageerror", err => errors.push(String(err)));
    page.on("request", request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
    await page.goto(url);
    await page.waitForSelector("#engineering-rows .project-row");
    assert.equal(await page.locator("#engineering-rows tr").count(), 6);
    await page.screenshot({ path: path.join(output, "engineering-desktop.png"), fullPage: true });
    await page.locator("#engineering-search").fill("cedar");
    assert.equal(await page.locator("#engineering-rows tr").count(), 1);
    await page.locator("#engineering-filter").selectOption("Settled");
    assert.equal(await page.locator("#engineering-empty").isVisible(), true);
    await page.locator("#engineering-search").fill("<img src=x onerror=alert(1)>");
    assert.equal(await page.locator("#engineering-rows img").count(), 0);
    await page.locator("#engineering-search").fill("");
    await page.locator("#engineering-filter").selectOption("all");
    await page.locator('[data-project="ENG-103"]').click();
    assert.equal(await page.locator("#contract-details h2").textContent(), "Juniper Walkway");
    await page.locator("#approve-contract").click();
    assert.equal(await page.locator("#approve-contract").isDisabled(), true);
    assert.equal(await page.locator("#contract-details .timeline li").count(), 4);
    assert.equal(await page.locator("#approval-queue .queue-item").count(), 2);
    await page.locator("#reset-demo").click();
    assert.equal(await page.locator("#approval-queue .queue-item").count(), 3);
    await page.locator('[data-view="video"]').click();
    assert.equal(await page.locator("#video-projects article").count(), 6);
    await page.locator(".skip-link").focus();
    await page.locator(".skip-link").press("Enter");
    assert.equal(new URL(page.url()).hash, "#video");
    assert.equal(await page.locator("#video-title").isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), "main");
    // Wait for the feedback from Reset to disappear before the baseline screenshot.
    await page.locator("#toast").evaluate(node => node.classList.remove("visible"));
    await page.screenshot({ path: path.join(output, "video-desktop.png"), fullPage: true });
    await page.locator('[data-stage="制作中"]').click();
    assert.equal(await page.locator("#video-projects article").count(), 2);
    await page.locator("#video-search").fill("unknown");
    assert.equal(await page.locator("#video-empty").isVisible(), true);
    await page.locator("#video-search").fill("");
    await page.locator('[data-stage="all"]').click();
    await page.locator('[data-task="3"]').check();
    assert.equal(await page.locator('[data-task="3"]').isChecked(), true);
    assert.match(await page.locator("#video-metrics").textContent(), /15/);
    await page.locator('[data-task="3"]').uncheck();
    assert.equal(await page.locator('[data-task="3"]').isChecked(), false);
    await page.locator('[data-pin="v1"]').click();
    assert.equal(await page.locator('[data-pin="v1"]').getAttribute("aria-pressed"), "true");
    assert.equal(await page.locator('[data-pin="v3"]').getAttribute("aria-pressed"), "false");
    await page.locator("#video-stage").selectOption("已交付");
    assert.equal(await page.locator("#video-stage").inputValue(), "已交付");
    await page.locator('[data-video="VID-104"]').click();
    assert.equal(await page.locator("#video-details h2").textContent(), "Small wonders");
    assert.equal(await page.locator("#video-details .file-row").count(), 1);
    await page.locator("#reset-demo").click();
    assert.equal(await page.locator("#video-stage").inputValue(), "待审片");
    assert.equal(await page.locator('[data-pin="v3"]').getAttribute("aria-pressed"), "true");
    await page.locator('[data-view="about"]').click();
    assert.equal(await page.locator("#about-title").isVisible(), true);
    await page.locator(".skip-link").focus();
    await page.locator(".skip-link").press("Enter");
    assert.equal(new URL(page.url()).hash, "#about");
    assert.equal(await page.locator("#about-title").isVisible(), true);
    assert.equal(await page.evaluate(() => document.activeElement.id), "main");
    await page.goBack();
    assert.equal(await page.locator("#video-title").isVisible(), true);
    await page.goForward();
    assert.equal(await page.locator("#about-title").isVisible(), true);
    await page.goto(url + "#video");
    assert.equal(await page.locator("#video-title").isVisible(), true);
    // Reload restores all memory-only state.
    await page.locator('[data-pin="v1"]').click();
    await page.reload();
    assert.equal(await page.locator('[data-pin="v3"]').getAttribute("aria-pressed"), "true");
    for (const viewport of [{ width: 390, height: 844 }, { width: 768, height: 1024 }]) {
      await page.setViewportSize(viewport);
      for (const view of ["engineering", "video", "about"]) {
        await page.goto(`${url}#${view}`);
        assert.equal(await page.locator(`#${view}-view`).isVisible(), true);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        assert.equal(overflow, false, `Page overflow at ${viewport.width}px on ${view}`);
        if (viewport.width === 390 && view !== "about") await page.screenshot({ path: path.join(output, `${view}-mobile.png`), fullPage: true });
      }
    }
    assert.deepEqual(errors, [], "No browser runtime errors");
    assert.deepEqual(network, [], "No HTTP(S) requests from the local app");
    console.log("PASS: Chromium desktop/mobile/tablet smoke checks; search/filter/empty states, approval/reset, task toggles, stage changes, pinning, deep links, browser history, reload, no page overflow, no runtime errors, no HTTP(S) requests.");
    console.log("Screenshots saved: engineering-desktop.png, video-desktop.png, engineering-mobile.png, video-mobile.png.");
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
