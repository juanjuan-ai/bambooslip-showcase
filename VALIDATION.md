# Validation record

Prepared on 2026-10-21. This record covers the newly authored showcase only. It does not validate either original source system.

## Passed

- JavaScript syntax: `node --check model.js`, `node --check app.js`
- Dependency-free Node model tests: fresh snapshots and totals; case-insensitive search; combined filters and empty results; one-time simulated approvals; reversible task changes; valid stage changes; project-scoped version pinning; identifier/progress/version consistency
- Static scope checks: runtime asset references are local; no upload controls; no external app-data request APIs or persistent-storage APIs; no credential material detected by the targeted pattern check

These targeted checks are not a comprehensive security audit or a certification that every possible defect is absent.

## Not completed

- Browser smoke test, browser interaction verification, screenshot capture and visual/mobile/tablet review
- Cross-browser testing, real-device testing and comprehensive accessibility audit
- Hosted deployment or publication verification
- Original source-system build, runtime, API, database, authentication or authorization tests

The local Chromium launch was blocked by the execution environment's local-socket restrictions. The supported escalation route also failed at runtime. The cloud browser did not permit direct `file:` navigation. No screenshot or browser-test success is claimed.

## Reproducible checks

```sh
npm run check
npm test
```

Optional, in an environment with Playwright and Chromium:

```sh
node tests/browser-smoke.cjs
```

The optional script checks search/filter/empty states, selected details, approval and reset, repeated task toggles, stage changes, current-version selection, deep links, Back/Forward navigation and reload. It also checks page overflow at mobile/tablet viewport sizes, browser runtime errors and HTTP(S) requests while opening the local app. It saves screenshots only if browser execution succeeds.

## 中文摘要

已通过新编写演示代码的 JavaScript 语法、数据模型单元测试及针对性的静态范围检查。浏览器运行受准备环境限制，尚未完成浏览器交互、截图、视觉与移动端验证。未验证原系统的构建、后端、数据库、登录或权限行为；未验证线上发布。本记录不会将未执行的检查写为通过。
