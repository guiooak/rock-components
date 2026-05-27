# Stud Components — Foundation Plan

## Context

We're building a React component library and design system called **Stud Components** from scratch. The repository currently contains only a `.gitignore` and `LICENSE` (MIT). The goal is to set up all foundational infrastructure — tooling, tokens, themes, testing, Storybook — so that components can be built on a solid, consistent base. No UI components will be created in this phase (except a template/example).

## Decisions

| Area | Choice | Rationale |
|------|--------|-----------|
| Package manager | **Yarn** | User preference |
| CSS | **CSS Modules** (raw `.module.css`) | Scoped CSS, zero runtime, plain CSS syntax |
| Build | **Vite library mode** | Native CSS Modules support, shared tooling with Storybook |
| Themes | **Light + Dark from day one** | CSS custom properties on `:root`, dark via `[data-theme="dark"]` |
| Token overrides | **Pure CSS (no `tokens` prop)** | Portal-safe, zero runtime, smaller API; consumers re-declare `--sd-*` in their own stylesheet |
| Naming prefix | **`sd-` for both classes and CSS variables** | Single mental model; collision risk is negligible for a domain-specific 2-letter prefix |
| Colors | **Neutral starter palette** | Open-color-inspired, easy to rebrand later |

---

## Engineering Guidelines

The seven-point quality bar every Stud component must meet lives as a Storybook docs page at [`src/docs/2-engineering-guidelines.mdx`](../../src/docs/2-engineering-guidelines.mdx) — that file is the canonical, consumer-facing source of truth. The reference implementation in `src/components/_template/` must embody every point.

At a glance:

1. **Lean, agnostic API** — minimum viable props; no speculative features.
2. **No business rules** — components are domain-neutral and reusable across any feature.
3. **All use cases documented in Storybook** — variants, states, and edge cases.
4. **Authored in TypeScript with strict types** — exported props, typed refs, discriminated unions.
5. **Fully covered by unit tests** — Vitest + Testing Library, including `vitest-axe`.
6. **Class naming convention** — `sd-` prefix, BEM, public root class via `:global(...)` in CSS Modules.
7. **Accessible by default** — WAI-ARIA, keyboard, focus management, color-independent state.

---

## Implementation Steps

### Step 1: Package initialization

- Create `package.json` with Yarn
- Configure `name`, `version`, `type: "module"`, `exports`, `peerDependencies`, `files`, `sideEffects`
- Peer deps: `react ^18 || ^19`, `react-dom ^18 || ^19`
- **`exports` map** designed for both barrel and per-component imports so consumers can opt into the smallest possible graph:
  - `.` — main barrel (all components, provider, hooks)
  - `./styles.css` — aggregated CSS bundle (see Step 17)
  - `./tokens` — CSS variable name constants (see Step 6)
  - `./<component>` — per-component subpaths (e.g., `./button`, `./modal`), each with its own `import`/`require` conditions and types
  - Pattern entries (`"./*": "./dist/*.js"`) are avoided — every public entry is enumerated explicitly so removals are intentional and `attw`/`publint` can verify them
- Vite library mode is configured with one entry per component plus the root barrel, so each subpath gets its own chunk and consumers pay for only what they import
- **Pin tooling versions** so contributors and CI run on identical toolchains:
  - `packageManager: "yarn@4.x.x"` (corepack-managed)
  - `engines: { "node": ">=20.11" }`
  - `.nvmrc` at repo root with the matching Node major version

### Step 2: Install dependencies

**Runtime dependencies:**
- `clsx` (className merging — ~250 bytes, zero alternatives worth maintaining ourselves)

**Dev dependencies:**
- `typescript`, `react`, `react-dom`, `@types/react`, `@types/react-dom`
- `vite`, `vite-plugin-dts`, `@vitejs/plugin-react`
- `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `vitest-axe` (a11y assertions in unit tests, required by Engineering Guideline #7)
- `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `prettier`, `eslint-config-prettier`
- `@arethetypeswrong/cli`, `publint` (type-export and packaging sanity checks; see Verification)
- `size-limit`, `@size-limit/preset-small-lib` (per-entry bundle-size budget enforced in CI)
- `@changesets/cli` (versioning + changelog automation; see Step 14.6)
- `husky`, `lint-staged`
- Storybook packages (via `npx storybook@latest init`)
- `@storybook/addon-a11y`

### Step 3: TypeScript config (`tsconfig.json`)

- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`
- `jsx: react-jsx`, `strict: true`, `verbatimModuleSyntax: true`
- `declaration: true`, `declarationMap: true`
- CSS Modules type declarations via `src/types/css.d.ts`

### Step 4: Vite build config (`vite.config.ts`)

- Library mode with **multiple entries**: the root barrel (`src/index.ts`) plus one entry per public component (`src/components/<name>/index.ts`), preserving module structure so each subpath in `package.json#exports` resolves to its own chunk
- Output formats: `es` and `cjs`
- External: `react`, `react-dom`
- CSS Modules enabled (default in Vite)
- **Deterministic CSS Modules class names** via `css.modules.generateScopedName: '[name]_[local]_[hash:base64:5]'` so generated names are stable across builds (readable in DevTools, snapshot-friendly, easier to debug). Public root classes use `:global(.sd-*)` and bypass scoping entirely.
- `vite-plugin-dts` for `.d.ts` generation
- `@vitejs/plugin-react` for JSX

### Step 5: Project structure

```
stud-components/
  .storybook/
    main.ts
    preview.ts
  src/
    components/
      _template/
        Template.tsx
        Template.module.css
        Template.test.tsx
        Template.stories.tsx
        index.ts
    tokens/
      colors.css              # CSS custom properties
      spacing.css
      typography.css
      shadows.css
      radii.css
      breakpoints.css
      z-index.css
      index.css               # Imports all token files
      index.ts                # JS exports of token values
    themes/
      light.css               # :root { ... }
      dark.css                # [data-theme="dark"] { ... }
      index.css               # Imports both themes
    styles/
      reset.css               # CSS reset/normalize
      global.css              # Global base styles
    provider/
      StudProvider.tsx
      StudProvider.test.tsx
      index.ts
    types/
      css.d.ts                # CSS Modules type declarations
    utils/
      test-setup.ts
      test-utils.tsx
    index.ts                  # Main barrel export
  .prettierrc.json
  .prettierignore
  eslint.config.js
  tsconfig.json
  vite.config.ts
  vitest.config.ts
```

### Step 6: Design tokens (CSS custom properties)

Tokens defined as CSS custom properties in plain `.css` files under `src/tokens/`:

- **colors.css**: Neutral scale (50–900), primary scale, semantic colors (success, warning, error, info)
- **spacing.css**: 4px base scale (0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80)
- **typography.css**: Font families (sans, mono), sizes (xs–4xl), weights, line-heights
- **shadows.css**: sm, md, lg elevation levels
- **radii.css**: sm, md, lg, full
- **breakpoints.css**: sm, md, lg, xl (as custom properties and documented values)
- **z-index.css**: Layering scale (dropdown, sticky, modal, popover, tooltip)
- **index.css**: Aggregates all token files via `@import`

All tokens namespaced with `--sd-` prefix (e.g., `--sd-color-primary-600`).

A TypeScript barrel (`tokens/index.ts`) exports the **CSS variable names** as typed constants — a programmatic reference for consumers who need to mutate tokens at runtime via `element.style.setProperty(...)`:

```ts
export const tokens = {
  colorPrimary: '--sd-color-primary',
  colorBg: '--sd-color-bg',
  spacingUnit: '--sd-spacing-unit',
  // ...
} as const;

export type TokenName = keyof typeof tokens;
```

**Token override architecture**: Defaults are set in CSS files (`:root` and `[data-theme]`). Overrides happen entirely in CSS — consumers re-declare `--sd-*` variables in their own stylesheet, loaded after Stud's:

```css
:root {
  --sd-color-primary: #e63946;
  --sd-spacing-unit: 6px;
}

.brand-section {
  --sd-color-primary: #2a9d8f; /* scoped subtree override */
}
```

This approach is deliberate:

- **Portal-safe** — overrides on `:root` cascade to portals (which mount under `document.body`), so modals, tooltips, and popovers inherit naturally. The wrapper-div + inline-style approach we considered earlier broke here.
- **Zero runtime** — no JS computation, no re-renders on token change, no injected wrapper div.
- **Smaller API surface** — no `StudTokens` type, no `tokens` prop on the provider, no `mapTokensToCSS` helper to maintain.
- **Standard CSS** — consumers already know how to override custom properties; scoped overrides come for free via the cascade.

Runtime mutation (e.g., a user-facing theme picker) is the consumer's responsibility:

```ts
import { tokens } from 'stud-components/tokens';
document.documentElement.style.setProperty(tokens.colorPrimary, userColor);
```

### Step 7: Themes

- **`themes/light.css`**: Sets semantic token values on `:root` (e.g., `--sd-color-bg`, `--sd-color-fg`, `--sd-color-primary`)
- **`themes/dark.css`**: Overrides semantic tokens on `[data-theme="dark"]`
- Components reference only semantic tokens (`--sd-color-bg`) not raw palette tokens (`--sd-color-neutral-0`), so theme switching "just works"

### Step 8: CSS reset & global styles

- **`styles/reset.css`**: Modern CSS reset (box-sizing, margin reset, img display, etc.)
- **`styles/global.css`**: Applies font-family, base font-size, color, and background from tokens

### Step 9: StudProvider

A minimal provider that owns theme switching and exposes theme context. It does **not** accept a `tokens` prop — token overrides are pure CSS (see Step 6).

- Props:
  - `children: ReactNode`
  - `theme?: 'light' | 'dark' | 'system'` (default `'system'`)
- Applies `data-theme` attribute on a wrapping `<div>` (or the document root — see open question below). When `theme="system"`, follows `prefers-color-scheme` via `matchMedia` and updates on change.
- Exposes a `useStudTheme()` context hook returning `{ theme, resolvedTheme, setTheme }` so components and consumers can read and switch themes.
- Example consumer usage:
  ```tsx
  <StudProvider theme="system">
    <App />
  </StudProvider>
  ```
- Token overrides happen in the consumer's CSS, not through this component:
  ```css
  :root {
    --sd-color-primary: #e63946;
  }
  ```

### Step 10: Utility helpers

- **className merging**: use `clsx` (~250 bytes) as a runtime dep — no hand-rolled helper. Re-exported from `src/index.ts` only if components actually need consumers to use the same instance; otherwise components import it internally.
- **`test-utils.tsx`**: Custom `render` wrapping components in `StudProvider`
- **`test-setup.ts`**: Imports `@testing-library/jest-dom/vitest` and registers `vitest-axe` matchers (`expect.extend({ toHaveNoViolations })`)
- **`css.d.ts`**: Declares `*.module.css` modules for TypeScript

### Step 11: Vitest config (`vitest.config.ts`)

- Environment: `jsdom`
- Setup files: `src/utils/test-setup.ts`
- Coverage: v8, exclude stories/tests/index files
- Globals: true

### Step 12: ESLint (`eslint.config.js`)

- Flat config format (ESLint 9+)
- `@eslint/js` recommended + `typescript-eslint` strict + stylistic
- `eslint-plugin-react-hooks` + `eslint-plugin-jsx-a11y`
- `eslint-config-prettier` to disable conflicting rules

### Step 13: Prettier (`.prettierrc.json`) and EditorConfig

- Prettier: single quotes, trailing commas, 80 print width, 2-space tabs
- `.editorconfig` at repo root for IDE-level consistency before formatting kicks in: UTF-8, LF line endings, 2-space indent, trim trailing whitespace, final newline

### Step 14: Husky + lint-staged

- `npx husky init` for pre-commit hook
- lint-staged: ESLint fix + Prettier on `*.{ts,tsx}`, Prettier on `*.{json,md,css}`

### Step 14.5: Continuous Integration (`.github/workflows/ci.yml`)

A single CI workflow runs on every pull request and on pushes to `main`. It must mirror the local Verification steps so contributors can reproduce CI failures locally without guesswork.

- Runs on `pull_request` and `push` to `main`
- Matrix-free (single Node version pinned via `.nvmrc` / `actions/setup-node@v4` with `node-version-file: '.nvmrc'`)
- Uses Corepack for Yarn (`corepack enable`) so the `packageManager` field in `package.json` drives the version
- Caches Yarn install via `actions/setup-node`'s built-in cache
- Steps, in order, fail-fast:
  1. `yarn install --immutable`
  2. `yarn format:check`
  3. `yarn lint`
  4. `yarn typecheck`
  5. `yarn test --coverage`
  6. `yarn verify-package` (build + publint + attw)
  7. `yarn size`
  8. `yarn build-storybook` (smoke check that docs still build)

Branch protection on `main` requires the workflow to pass before merge.

### Step 14.6: Release automation (Changesets)

Versioning, changelogs, and publishing are owned by [Changesets](https://github.com/changesets/changesets) from day one. Manual `npm version` bumps and hand-written changelogs are out of scope.

- `npx changeset init` creates `.changeset/config.json` (set `access: "public"`, `baseBranch: "main"`)
- Contributors run `yarn changeset` as part of any PR that affects published code; the resulting markdown file in `.changeset/` is reviewed alongside the diff
- `yarn changeset:version` (script alias for `changeset version`) bumps `package.json` and writes `CHANGELOG.md`
- `yarn changeset:publish` (alias for `changeset publish`) tags and publishes to npm
- A separate workflow `.github/workflows/release.yml` (triggered on push to `main`) uses `changesets/action@v1` to either open a "Version Packages" PR or publish when that PR merges. `NPM_TOKEN` lives as a repo secret.
- Scripts to add in `package.json`:
  ```json
  {
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "changeset publish"
  }
  ```

### Step 15: Storybook

- Init with `npx storybook@latest init --builder vite --type react`
- `.storybook/main.ts`: Configure stories glob (includes `src/**/*.stories.tsx` and `src/docs/**/*.mdx`), addons (essentials, a11y, interactions), autodocs
- `.storybook/preview.ts`: Theme switcher in toolbar (light/dark), decorators wrapping stories in `StudProvider`
- **Docs MDX pages** under `src/docs/` (numbered to control sidebar order):
  - `1-introduction.mdx` — what Stud Components is, install + quick-start
  - `2-engineering-guidelines.mdx` — the seven-point quality bar (**already authored**)
  - `3-design-principles.mdx` — token philosophy, semantic vs raw tokens, theming model
  - `4-tokens.mdx` — generated reference of all `--sd-*` tokens
  - `5-contributing.mdx` — how to add a new component (mirrors `_template/`)
- Configure `storySort` in `.storybook/preview.ts` so `Docs/*` pages appear first in the sidebar, ahead of `Components/*`

### Step 16: Component template

Create `src/components/_template/` as the canonical reference — it must embody every point of the Engineering Guidelines so contributors copy it as a starting point:

- `Template.tsx` — functional component with exported props interface, `forwardRef`, CSS module import; root element renders the public block class via `:global(.sd-template)` plus any scoped element/modifier classes from the module
- `Template.module.css` — scoped styles using semantic tokens only (no raw palette tokens), with `:global(.sd-template)` for the public root class and BEM-style element/modifier classes (`__header`, `--disabled`, etc.)
- `Template.test.tsx` — render, prop variants, interactions, ref forwarding, and `vitest-axe` accessibility assertion
- `Template.stories.tsx` — default story plus variant/state stories covering loading, disabled, error, and edge cases; `autodocs` tag enabled
- `index.ts` — barrel export of the component and its props type
- `_template/` is excluded from the public build (`vite.config.ts` lib entry) and not re-exported from `src/index.ts`

### Step 17: Main barrel export (`src/index.ts`) and styles entry

The JS barrel **does not import any CSS**. Consumers explicitly load styles via the `./styles.css` subpath, which keeps `sideEffects: false` honest and allows full JS tree-shaking.

```ts
// src/index.ts — pure JS, zero side effects
export { StudProvider, useStudTheme } from './provider';
export type { StudProviderProps, StudTheme } from './provider';

export * from './tokens'; // CSS variable name constants

// Components will be added here
```

A separate CSS entry aggregates reset + tokens + themes + globals, exposed via the package's `exports` map as `./styles.css`:

```css
/* src/styles.css — aggregated bundle */
@import './styles/reset.css';
@import './tokens/index.css';
@import './themes/index.css';
@import './styles/global.css';
```

Consumer setup becomes a one-liner alongside the JS import:

```ts
import 'stud-components/styles.css';
import { StudProvider } from 'stud-components';
```

`package.json` reflects this:
- `"sideEffects": false` (JS is fully tree-shakable)
- `"exports": { ".": ..., "./styles.css": "./dist/styles.css", "./tokens": ... }`

### Step 18: Scripts in `package.json`

```json
{
  "dev": "storybook dev -p 6006",
  "build": "vite build",
  "build-storybook": "storybook build",
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage",
  "typecheck": "tsc --noEmit",
  "publint": "publint",
  "attw": "attw --pack .",
  "verify-package": "yarn build && yarn publint && yarn attw",
  "size": "size-limit",
  "prepare": "husky"
}
```

A `size-limit` config block in `package.json` declares a budget per public entry (root barrel + each component subpath + the styles bundle). Initial budgets are intentionally generous; tighten as the library matures. CI runs `yarn size` on every PR so regressions surface before merge.

---

## Verification

After implementation, verify everything works end-to-end:

1. **Build**: `yarn build` — should produce `dist/` with ESM, CJS, types, and CSS
2. **Type check**: `yarn typecheck` — no errors
3. **Lint**: `yarn lint` — no errors
4. **Format**: `yarn format:check` — all files formatted
5. **Test**: `yarn test` — template component tests pass (including `vitest-axe` assertions)
6. **Package sanity**: `yarn verify-package` — runs `publint` (catches malformed `exports`, missing files, bad `main`/`module`/`types`) and `attw --pack .` (catches type-export issues across ESM/CJS/dual-publish)
7. **Bundle size**: `yarn size` — every public entry stays within its declared budget
8. **Storybook**: `yarn dev` — opens at localhost:6006, template component renders, theme switcher works (light/dark/system), a11y addon shows results
9. **Pre-commit hook**: Stage a file and commit — lint-staged should run automatically

---

## Files to create (in order)

1. `package.json`
2. `tsconfig.json`
3. `vite.config.ts`
4. `vitest.config.ts`
5. `eslint.config.js`
6. `.prettierrc.json` + `.prettierignore` + `.editorconfig`
7. `src/types/css.d.ts`
8. `src/tokens/*.css` + `src/tokens/index.ts`
9. `src/themes/light.css` + `src/themes/dark.css` + `src/themes/index.css`
10. `src/styles/reset.css` + `src/styles/global.css`
11. `src/utils/test-setup.ts` + `src/utils/test-utils.tsx`
12. `src/provider/StudProvider.tsx` + test + index
13. `src/index.ts`
14. `.storybook/main.ts` + `.storybook/preview.ts`
15. `src/docs/*.mdx` (introduction, engineering guidelines, design principles, tokens, contributing)
16. `src/components/_template/*` (all template files)
17. Husky + lint-staged setup
18. `.github/workflows/ci.yml`
19. `.changeset/config.json` + `.github/workflows/release.yml`
20. `.nvmrc`
21. Update `.gitignore`
