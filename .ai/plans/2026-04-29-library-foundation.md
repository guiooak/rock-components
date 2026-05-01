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
- `exports` map: `.` (main), `./tokens`, `./styles.css`

### Step 2: Install dependencies

**Dev dependencies:**
- `typescript`, `react`, `react-dom`, `@types/react`, `@types/react-dom`
- `vite`, `vite-plugin-dts`, `@vitejs/plugin-react`
- `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `prettier`, `eslint-config-prettier`
- `husky`, `lint-staged`
- Storybook packages (via `npx storybook@latest init`)
- `@storybook/addon-a11y`

### Step 3: TypeScript config (`tsconfig.json`)

- `target: ES2022`, `module: ESNext`, `moduleResolution: bundler`
- `jsx: react-jsx`, `strict: true`, `verbatimModuleSyntax: true`
- `declaration: true`, `declarationMap: true`
- CSS Modules type declarations via `src/types/css.d.ts`

### Step 4: Vite build config (`vite.config.ts`)

- Library mode with `entry: src/index.ts`
- Output formats: `es` and `cjs`
- External: `react`, `react-dom`
- CSS Modules enabled (default in Vite)
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
      cn.ts                   # className merge helper
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

All tokens namespaced with `--stud-` prefix (e.g., `--stud-color-primary-600`).

A TypeScript barrel (`tokens/index.ts`) will also export:
- Token values as JS constants for programmatic use
- A `StudTokens` type representing all overridable tokens (used by `StudProvider`'s `tokens` prop)
- A `tokenToCSSVar` map connecting camelCase token names to their `--stud-*` CSS variable names

**Token override architecture**: Defaults are set in CSS files (`:root` and `[data-theme]`). Overrides are applied via inline `style` on the `StudProvider` wrapper div. Since inline CSS custom properties cascade into children, any component using `var(--stud-*)` automatically picks up the override. This is zero-config for consumers — just pass the values you want to change.

### Step 7: Themes

- **`themes/light.css`**: Sets semantic token values on `:root` (e.g., `--stud-color-bg`, `--stud-color-fg`, `--stud-color-primary`)
- **`themes/dark.css`**: Overrides semantic tokens on `[data-theme="dark"]`
- Components reference only semantic tokens (`--stud-color-bg`) not raw palette tokens (`--stud-color-neutral-0`), so theme switching "just works"

### Step 8: CSS reset & global styles

- **`styles/reset.css`**: Modern CSS reset (box-sizing, margin reset, img display, etc.)
- **`styles/global.css`**: Applies font-family, base font-size, color, and background from tokens

### Step 9: StudProvider (with token overrides)

- Wrapper component that applies theme, imports global CSS, and allows token overrides
- Props:
  - `children: ReactNode`
  - `theme: 'light' | 'dark'` (default `'light'`)
  - `tokens?: Partial<StudTokens>` — consumer can override any token value
- Applies `data-theme` attribute on a wrapping `<div>`
- Token overrides are applied as inline CSS custom properties on the wrapper `<div>`, which cascade over the defaults defined in the theme CSS files
- Example consumer usage:
  ```tsx
  <StudProvider theme="dark" tokens={{ colorPrimary: '#e63946', spacingUnit: '6px' }}>
    <App />
  </StudProvider>
  ```
- A `StudTokens` type is generated from the token definitions, mapping camelCase prop names to `--stud-*` CSS custom property names
- Also exposes a `useStudTheme` context hook for components that need to read the current theme
- A helper function `mapTokensToCSS(tokens)` converts the partial tokens object to a `CSSProperties` style object with the corresponding `--stud-*` variables

### Step 10: Utility helpers

- **`cn.ts`**: Simple className merge utility (concatenates and filters falsy values)
- **`test-utils.tsx`**: Custom `render` wrapping components in `StudProvider`
- **`test-setup.ts`**: Imports `@testing-library/jest-dom/vitest`
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

### Step 13: Prettier (`.prettierrc.json`)

- Single quotes, trailing commas, 80 print width, 2-space tabs

### Step 14: Husky + lint-staged

- `npx husky init` for pre-commit hook
- lint-staged: ESLint fix + Prettier on `*.{ts,tsx}`, Prettier on `*.{json,md,css}`

### Step 15: Storybook

- Init with `npx storybook@latest init --builder vite --type react`
- `.storybook/main.ts`: Configure stories glob (includes `src/**/*.stories.tsx` and `src/docs/**/*.mdx`), addons (essentials, a11y, interactions), autodocs
- `.storybook/preview.ts`: Theme switcher in toolbar (light/dark), decorators wrapping stories in `StudProvider`
- **Docs MDX pages** under `src/docs/` (numbered to control sidebar order):
  - `1-introduction.mdx` — what Stud Components is, install + quick-start
  - `2-engineering-guidelines.mdx` — the seven-point quality bar (**already authored**)
  - `3-design-principles.mdx` — token philosophy, semantic vs raw tokens, theming model
  - `4-tokens.mdx` — generated reference of all `--stud-*` tokens
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

### Step 17: Main barrel export (`src/index.ts`)

```ts
// Provider
export { StudProvider } from './provider';
export type { StudProviderProps, StudTheme } from './provider';

// Themes (CSS imports)
import './themes/index.css';
import './styles/reset.css';
import './styles/global.css';

// Tokens
export * from './tokens';

// Components will be added here
```

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
  "prepare": "husky"
}
```

---

## Verification

After implementation, verify everything works end-to-end:

1. **Build**: `yarn build` — should produce `dist/` with ESM, CJS, types, and CSS
2. **Type check**: `yarn typecheck` — no errors
3. **Lint**: `yarn lint` — no errors
4. **Format**: `yarn format:check` — all files formatted
5. **Test**: `yarn test` — template component tests pass
6. **Storybook**: `yarn dev` — opens at localhost:6006, template component renders, theme switcher works (light/dark), a11y addon shows results
7. **Pre-commit hook**: Stage a file and commit — lint-staged should run automatically

---

## Files to create (in order)

1. `package.json`
2. `tsconfig.json`
3. `vite.config.ts`
4. `vitest.config.ts`
5. `eslint.config.js`
6. `.prettierrc.json` + `.prettierignore`
7. `src/types/css.d.ts`
8. `src/tokens/*.css` + `src/tokens/index.ts`
9. `src/themes/light.css` + `src/themes/dark.css` + `src/themes/index.css`
10. `src/styles/reset.css` + `src/styles/global.css`
11. `src/utils/cn.ts` + `src/utils/test-setup.ts` + `src/utils/test-utils.tsx`
12. `src/provider/StudProvider.tsx` + test + index
13. `src/index.ts`
14. `.storybook/main.ts` + `.storybook/preview.ts`
15. `src/docs/*.mdx` (introduction, engineering guidelines, design principles, tokens, contributing)
16. `src/components/_template/*` (all template files)
17. Husky + lint-staged setup
18. Update `.gitignore`
