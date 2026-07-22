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
- **Scenario photography (bring-your-own AI images)** — the way to get genuinely top-grade art into branching scenarios and conversations. ClypCompiler works out exactly which images your course needs (a discovery pass over the compiled course: role × gender × age × skin tone × expression × gesture, plus every scene), and for each one gives you a **production-ready photoreal prompt** and the **filename to save it as**. Generate them in any tool — Midjourney, Firefly, gpt-image-1, whatever you prefer — drop the folder in, and they are matched automatically.
  - **Consistent characters.** Each character spec is hashed into a fixed physical description (hair, face, distinguishing feature, build) that is repeated verbatim in every prompt for that character, so the same person appears across all their expressions in any tool. Pair it with a seed or character reference for an exact lock.
  - **Filename fallback.** `char__manager__female__adult__light__happy__pointing` matches exactly; `…__happy` covers every gesture for that expression; `…__light` covers that character everywhere. Generate the specific ones only where it matters.
  - **Partial sets are fine.** Anything you haven't supplied falls back to rendered art, so the course always compiles and exports.
  - Images are downscaled on import to keep courses portable, and only images actually used are packaged.
- **Built-in art library** — with the **Rendered** art style, ClypCompiler rasterizes Clyp's vector art at compile time with a cinematic grade, rim light and contact shadow on characters, and light shafts, split-tone, vignette and grain on scenes. Useful as a fallback layer, or on its own. **Illustrated** keeps the original vectors (smallest packages, infinitely sharp).
- **Assets Library** — upload your own images and assign them in place of the image placeholders or SVG graphics inside any block; choose fill or fit. Only assets actually used are packaged.
- **Mobile-friendly output** — the generated player is mobile-first (off-canvas lesson drawer under 900 px) and Clyp blocks are mobile-first by design. The in-app player previews mobile / tablet / desktop widths.
- **SCORM or HTML5 export** — one click produces a zip. The SCORM 1.2 package (with `imsmanifest.xml`) reports status, score and suspend data to any compliant LMS. **Either package's extracted `index.html` is a fully functional web course without an LMS** — progress falls back to `localStorage`.
- **Course Player** — preview the exact runtime learners get (identical code path to export).
- **Compiler Logic** — the ported Clyp Master Compiler validates every block on import and again at export; any critical/error issue blocks packaging with a detailed report. Blocks compile to scoped CSS and namespaced, error-isolated JS so they can never break each other.

## Workflow

1. **Create a course** on the start screen (recent projects are stored locally).
2. **Import `.clyp` files** into lessons via the structure tree ("+ Import .clyp blocks").
3. Configure **course settings** (details, theme, art style, gamification, gatekeeping), **lessons** (title, description, theme override, badge icon) and **blocks** (title, XP override, image/SVG replacement, per-block preview).
4. For scenarios and conversations, open **Scenario photography**: download the image brief, generate the images, drop them back in. Coverage updates as they match.
5. **Preview** the course player, then **Export** as SCORM 1.2 or HTML5.
6. Optionally **Save project** as a `.clypcourse` file to share or back up.

## Desktop launcher

`npm run install:desktop` creates **ClypCompiler.lnk** on your desktop and in the Start Menu, with a generated multi-resolution icon (`build/clypcompiler.ico`).

The launcher (`Launch ClypCompiler.bat`) serves the built app from `http://127.0.0.1:4780` via `scripts/serve.mjs` — a dependency-free static server. Serving over a real origin (rather than opening the file from disk) is what gives the app full IndexedDB storage for autosave and the recent-projects list.

If Node.js isn't installed, the launcher falls back to the single-file `ClypCompiler.html` build, which runs straight from disk. That mode still works fully, but browsers restrict storage on `file://` origins, so ClypCompiler falls back to `localStorage` there — keep large courses as `.clypcourse` files.

You can also install it as a proper app window from the browser (Chrome/Edge: *Install ClypCompiler*), using the included web manifest.

## Deployment (GitHub Pages)

A workflow at `.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on every push to `main` (enable *Settings → Pages → Source: GitHub Actions*).

---

Created by Benedict de Jesus. Blocks are authored in Clyp; ClypCompiler consumes `.clyp` files as-is and never modifies them.
