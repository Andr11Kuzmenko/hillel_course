# Homework 33 — Gulp Build Pipeline

A minimal static site wired up with Gulp to demonstrate automated front-end tasks:

- **SCSS compilation** — Dart Sass compiles `src/scss/main.scss` into `dist/css/main.css`.
- **Vendor prefixes** — Autoprefixer adds prefixes based on the [`.browserslistrc`](.browserslistrc) targets.
- **Formatted output** — `main.css` is produced in `expanded` style for readable, well-structured CSS.
- **Minified bundle** — A separate `main.min.css` is generated through `clean-css` for production.
- **Live reload** — BrowserSync serves `dist/` and reloads the browser automatically when sources change.

## Requirements

- Node.js 18 or newer
- npm

## Install

```bash
cd full_stack/homework_33
npm install
```

## Run (dev mode)

```bash
npm start
```

This will:

1. Clean the `dist/` folder.
2. Compile and prefix the SCSS into `dist/css/main.css` (+ sourcemap) and `dist/css/main.min.css`.
3. Copy `src/*.html` and `src/assets/**` into `dist/`.
4. Start BrowserSync at <http://localhost:3000> and watch sources for changes.

## Build (production)

```bash
npm run build
```

Outputs a clean production build into `dist/` without starting the dev server.

## Clean

```bash
npm run clean
```

Removes the `dist/` folder.

## Project structure

```
homework_33/
├── gulpfile.js          # Gulp tasks: clean, styles, stylesMin, html, serve, build
├── package.json
├── .browserslistrc      # Autoprefixer targets
├── src/
│   ├── index.html
│   └── scss/
│       ├── main.scss    # Entry point
│       ├── abstracts/   # variables, mixins
│       ├── base/        # reset, layout
│       └── components/  # hero, features, footer
└── dist/                # Build output (generated)
```

## Gulp tasks

| Task         | Purpose                                                          |
| ------------ | ---------------------------------------------------------------- |
| `clean`      | Remove the `dist/` folder.                                       |
| `styles`     | Compile SCSS → autoprefix → write expanded CSS + sourcemap.      |
| `stylesMin`  | Compile SCSS → autoprefix → minify → write `main.min.css`.       |
| `html`       | Copy HTML files from `src/` to `dist/`.                          |
| `assets`     | Copy static assets from `src/assets/` to `dist/assets/`.         |
| `build`      | `clean` then run `styles`, `stylesMin`, `html`, `assets` in parallel. |
| `serve`      | Start BrowserSync and watch for changes.                         |
| `default`    | `build` + `serve` (the `npm start` entrypoint).                  |
