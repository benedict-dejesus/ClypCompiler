# ClypCompiler

ClypCompiler assembles **clypped codes** — `.clyp` block files authored in [Clyp](../clyp%20-%20cgpt_x_claude) — into complete, mobile-responsive e-learning courses, and exports them as **SCORM 1.2** or **HTML5** zip packages.

It runs entirely in the browser: as a **desktop app** (launcher included), or **online** via GitHub Pages. No server, no database — projects autosave locally and can be saved/opened as portable `.clypcourse` files.

## Quick start

```bash
npm install
npm run install:desktop   # builds the app + puts a ClypCompiler icon on your desktop
```

Then double-click the **ClypCompiler** desktop icon. It starts a small local server and opens your browser; close the console window to quit.

Other entry points:

```bash
npm run dev             # development server (hot reload)
npm run build           # static build in dist/ — deploy anywhere, incl. GitHub Pages
npm run build:offline   # single-file ClypCompiler.html — runs by double-clicking, no server
npm run typecheck
```

Sample `.clyp` blocks are included under `public/samples/` for trying the app.

## Features

- **Course & Lesson Builder** — organize imported `.clyp` blocks into lessons; reorder lessons and blocks; move blocks between lessons.
  - **Gamification** — XP per block (with per-block overrides), lesson bonuses, levels, automatic lesson/course badges plus custom badges (XP-threshold, lesson or course triggered), live XP bar and toasts in the player.
  - **Gatekeeping** — linear or free lesson navigation, lock icons, per-block completion rules (interactive blocks complete via their built-in completion gate; reading blocks complete on view), optional completion screen.
  - **Themes** — six course-wide themes, overridable per lesson.
- **Built-in art library + automatic replacement** — Clyp draws characters and scene backgrounds as inline SVG. With the **Rendered** art style (the default), ClypCompiler rasterizes them at compile time into high-end images: a cinematic color grade, warm rim light and contact shadow on characters (transparent PNG), and volumetric light shafts, split-tone grade, vignette and film grain on scenes (JPEG). Every variant your course actually uses is covered — role × gender × age × skin tone × expression × gesture — because rendering is driven by a discovery pass over the compiled course, not a fixed pre-baked set. Switch to **Illustrated** in *Course settings → Character & scene art* to keep the original vectors (smallest packages, infinitely sharp). Browse the whole library, or add any piece to your course assets, under **Assets library**.
- **Assets Library** — upload your own images and assign them in place of the image placeholders or SVG graphics inside any block; choose fill or fit. Only assets actually used are packaged.
- **Mobile-friendly output** — the generated player is mobile-first (off-canvas lesson drawer under 900 px) and Clyp blocks are mobile-first by design. The in-app player previews mobile / tablet / desktop widths.
- **SCORM or HTML5 export** — one click produces a zip. The SCORM 1.2 package (with `imsmanifest.xml`) reports status, score and suspend data to any compliant LMS. **Either package's extracted `index.html` is a fully functional web course without an LMS** — progress falls back to `localStorage`.
- **Course Player** — preview the exact runtime learners get (identical code path to export).
- **Compiler Logic** — the ported Clyp Master Compiler validates every block on import and again at export; any critical/error issue blocks packaging with a detailed report. Blocks compile to scoped CSS and namespaced, error-isolated JS so they can never break each other.

## Workflow

1. **Create a course** on the start screen (recent projects are stored locally).
2. **Import `.clyp` files** into lessons via the structure tree ("+ Import .clyp blocks").
3. Configure **course settings** (details, theme, art style, gamification, gatekeeping), **lessons** (title, description, theme override, badge icon) and **blocks** (title, XP override, image/SVG replacement, per-block preview).
4. **Preview** the course player, then **Export** as SCORM 1.2 or HTML5.
5. Optionally **Save project** as a `.clypcourse` file to share or back up.

## Desktop launcher

`npm run install:desktop` creates **ClypCompiler.lnk** on your desktop and in the Start Menu, with a generated multi-resolution icon (`build/clypcompiler.ico`).

The launcher (`Launch ClypCompiler.bat`) serves the built app from `http://127.0.0.1:4780` via `scripts/serve.mjs` — a dependency-free static server. Serving over a real origin (rather than opening the file from disk) is what gives the app full IndexedDB storage for autosave and the recent-projects list.

If Node.js isn't installed, the launcher falls back to the single-file `ClypCompiler.html` build, which runs straight from disk. That mode still works fully, but browsers restrict storage on `file://` origins, so ClypCompiler falls back to `localStorage` there — keep large courses as `.clypcourse` files.

You can also install it as a proper app window from the browser (Chrome/Edge: *Install ClypCompiler*), using the included web manifest.

## Deployment (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main` (enable *Settings → Pages → Source: GitHub Actions*).

---

Created by Benedict de Jesus. Blocks are authored in Clyp; ClypCompiler consumes `.clyp` files as-is and never modifies them.
