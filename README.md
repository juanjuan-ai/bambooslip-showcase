# BambooSlip · Workflow Showcase

Two newly authored, sanitized illustrative demos based on project features. All organizations, projects, contracts, amounts, tasks and file entries are fictional. **This is not a production implementation. Original business source code is excluded.**

两个依据项目功能重新编写的脱敏展示：工程业务管理与视频制作工作台。项目、合同、金额、任务和文件记录均为虚构。**本仓库不是生产系统，不包含原始业务源码。**

## Open the demos / 打开演示

Open `index.html` directly in a modern browser. No installation, build step, account or backend is required. All CSS, JavaScript and graphics are included locally.

直接用现代浏览器打开 `index.html`，无需安装、构建、账号或后端。界面以英文为主，附中文导航与制作阶段标签。

- [Engineering Operations Demo / 工程业务演示](index.html#engineering)
- [Video Production Workspace Demo / 视频制作演示](index.html#video)
- [Scope and technology notes / 范围与技术说明](index.html#about)

State exists only in memory. Reload the page or choose **Reset demo** to restore the initial fictional snapshot. Switching between the two demos preserves changes until reset or reload.

所有交互仅保存在当前页面内存中；刷新页面或点击 **Reset demo** 即可恢复初始样例。切换演示页面不会清除当前会话内的修改。

## 01 · Engineering Operations Demo

A project-centered workflow illustration for status visibility, contracts and settlement review.

### Implemented in this static demo / 本演示已实现

- Portfolio totals, fictional contract value, pending-approval count and settlement-to-review total
- Progress chart and approval queue using six fictional projects
- Case-insensitive project/contract search and status filtering
- Contract details and an approval timeline
- **Simulate approval**: updates the in-page status, queue and timeline once; no real approval, payment or external action occurs
- Reset to the original sample data

工程演示包含虚构项目看板、合同与待审结算金额、项目搜索和状态筛选、合同详情、审批时间线及模拟通过操作。模拟操作只改变页面内数据。

### Source-project feature context / 原项目功能背景

The source-project feature inventory includes project/member administration, partner directories, contracts and settlements, document archives, seal applications, drawing/photo records, work logs and templates, attachment organization, configurable workflows, role/data-scope administration and list import/export. These broader features are described as context; they are **not implemented** in this static demo.

原项目功能还涉及项目与成员、合作方、合同结算、资料档案、用印、图纸照片、日志模板、附件、可配置流程、角色与数据范围、列表导入导出。上述扩展功能仅作背景介绍，**本静态演示并未实现**。

Source-project technology context: Vue 3, Element Plus, Pinia, Vue Router, Axios and ECharts; Node.js / Express; MySQL 8 with SQLite compatibility; JWT and bcrypt. **The demo does not use that stack or reproduce its authentication, permissions, storage or backend.**

## 02 · Video Production Workspace Demo

A production workflow illustration for project stages, tasks and deliverable versions.

### Implemented in this static demo / 本演示已实现

- Six fictional production cards with newly authored CSS artwork
- Search and filters for 筹备 / 制作中 / 待审片 / 修改中 / 已交付
- Explicit stage selection, independently of task progress
- Reversible task checklists and computed progress
- Synthetic file-version inventory and a selectable current deliverable
- Reset to the original sample data

视频演示包含项目卡片、搜索和阶段筛选、明确的阶段切换、可勾选任务、进度计算、虚构文件版本及当前交付版本标记。勾选任务不会自动改变项目阶段。

### Source-project feature context / 原项目功能背景

The source-project feature inventory includes local folder metadata indexing, file search/filter/sort, bulk category changes, archive/restore, JSON backup/restore with conflict copies and local browser persistence. The file index describes filenames and metadata rather than uploading video contents. These capabilities are background context; **this demo does not access folders, import backups or handle real files**.

原项目还涉及本地文件夹元数据索引、文件检索筛选排序、批量分类、归档恢复、含冲突副本的 JSON 备份恢复和浏览器本地持久化。本演示仅用合成记录说明流程，**不访问文件夹、不导入备份、不处理真实文件**。

Source-project technology context: vanilla HTML, CSS, JavaScript and IndexedDB. **This newly authored demo uses HTML/CSS/JavaScript with memory-only state and does not use IndexedDB.**

## Safety and boundaries / 安全边界

- Newly authored demo code, fictional records and CSS artwork only
- No original source archives, database/schema files, deployment configuration, lockfiles, production URLs, private media or scan reports
- No personal contact details, original company names, credentials or API keys
- No backend, authentication, actual approval, payment or file storage
- No file picker, uploads or folder permissions
- No external fonts, CDNs, analytics, third-party runtime libraries or app data requests
- No cookies, localStorage or IndexedDB; changes do not persist across reloads
- No claim of production readiness, verified source-system behavior, client delivery or personal skill attribution
- No license grant is included; the source systems are not being published or relicensed

若将页面放到静态托管平台，浏览器仍需从托管方加载页面和本地资源；该演示自身不发起业务 API、分析统计或第三方资源请求。

## Files / 文件结构

- `index.html` — app shell, two views and scope notes
- `styles.css` — responsive layout and CSS artwork
- `model.js` — newly authored fictional data and pure state transitions
- `app.js` — rendering and interaction handling
- `assets/favicon.svg` — newly authored local icon
- `tests/model.test.js` — dependency-free model tests
- `tests/scope.test.js` — static scope checks
- `tests/browser-smoke.cjs` — optional Playwright smoke test and screenshot capture
- `VALIDATION.md` — checks actually run and remaining limits

## Checks / 检查

Node.js 18 or newer can run the dependency-free checks. There is nothing to install for these commands:

```sh
npm run check
npm test
```

The optional browser script requires Playwright available in the environment and an installed Chromium binary. It defaults to `/usr/bin/chromium`; set `CHROMIUM_PATH` for another path. It exercises both demos and can create screenshots under `screenshots/`:

```sh
node tests/browser-smoke.cjs
```

See [VALIDATION.md](VALIDATION.md) for the actual results. Browser execution was blocked in the preparation environment, so screenshots and visual/browser validation are not claimed.

实际验证结果见 [VALIDATION.md](VALIDATION.md)。准备环境未能启动可用的浏览器测试，因此不宣称已完成视觉、移动端或浏览器交互验证，也未提供伪造截图。
