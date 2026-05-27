# Stud Components

A React component library and design system, built to grow organically without losing its shape. Strict TypeScript, CSS Modules with semantic design tokens, light/dark/system themes from day one, and accessibility wired in by default.

## Status

Pre-1.0. The foundation is in place; components will land one at a time, each held to the [Engineering Guidelines](./src/docs/2-engineering-guidelines.mdx).

## Install

```bash
yarn add stud-components react react-dom
```

`react` and `react-dom` are peer dependencies (`^19`).

## Quick start

```tsx
import 'stud-components/styles.css';
import { StudProvider } from 'stud-components';

export const App = () => (
  <StudProvider theme="system">
    <YourApp />
  </StudProvider>
);
```

`StudProvider` follows `prefers-color-scheme` by default. Pass `theme="light"` or `theme="dark"` to force a value, or read and switch the theme imperatively with `useStudTheme()`.

## Customizing tokens

Tokens are CSS custom properties under the `--sd-*` namespace. Override them in your own stylesheet, loaded after `stud-components/styles.css`:

```css
:root {
  --sd-color-primary: #e63946;
  --sd-spacing-4: 1.25rem;
}

.brand-section {
  --sd-color-primary: #2a9d8f; /* scoped subtree override */
}
```

For runtime mutation, the typed CSS variable names are exported from `stud-components/tokens`:

```ts
import { tokens } from 'stud-components/tokens';

document.documentElement.style.setProperty(tokens.colorPrimary, '#e63946');
```

## What's inside

- **Strict TypeScript**, exported props, typed refs.
- **CSS Modules with semantic tokens** — components reference `--sd-color-bg`, never raw palette tokens. Theme switching just works.
- **Light, dark, and system themes** out of the box, applied via `data-theme`.
- **Pure-CSS token overrides** — no `tokens` prop on the provider, portal-safe, zero runtime cost.
- **`sd-` BEM classes** on every component root for stable, documented override hooks.
- **Accessibility-first** — WAI-ARIA patterns, keyboard handling, `vitest-axe` assertions in CI, Storybook a11y addon.
- **Per-component subpath imports** for the smallest possible bundle: `import { Button } from 'stud-components/button'`.

For the full story, see the Storybook docs:

- [Introduction](./src/docs/1-introduction.mdx)
- [Engineering Guidelines](./src/docs/2-engineering-guidelines.mdx)
- [Design Principles](./src/docs/3-design-principles.mdx)
- [Tokens reference](./src/docs/4-tokens.mdx)
- [Contributing — how to add a new component](./src/docs/5-contributing.mdx)

## Local development

### Prerequisites

- **Node**: pinned in `.nvmrc` (currently `22`). Use `nvm use` or any compatible version manager.
- **Yarn 4** via Corepack:

  ```bash
  corepack enable
  ```

### Install and run

```bash
yarn install
yarn dev          # Storybook on http://localhost:6006
```

### Useful scripts

| Command                             | What it does                                                 |
| ----------------------------------- | ------------------------------------------------------------ |
| `yarn dev`                          | Run Storybook locally (`http://localhost:6006`).             |
| `yarn build`                        | Build the library — JS, types, and bundled CSS into `dist/`. |
| `yarn build-storybook`              | Build the static Storybook site.                             |
| `yarn test`                         | Run unit tests (Vitest + Testing Library + `vitest-axe`).    |
| `yarn test:watch`                   | Vitest in watch mode.                                        |
| `yarn test:coverage`                | Tests with coverage reports.                                 |
| `yarn typecheck`                    | Run `tsc --noEmit`.                                          |
| `yarn lint` / `yarn lint:fix`       | ESLint with strict TypeScript rules.                         |
| `yarn format` / `yarn format:check` | Prettier.                                                    |
| `yarn verify-package`               | Build + `publint` + `attw` for packaging sanity.             |
| `yarn size`                         | Bundle-size budget check via `size-limit`.                   |

A pre-commit hook (Husky + lint-staged) runs ESLint and Prettier on staged files automatically.

## Contributing

Every component is a copy-and-adapt of the reference template at [`src/components/_template/`](./src/components/_template/). The full walkthrough is in the [Contributing docs page](./src/docs/5-contributing.mdx); the short version is:

1. **Copy the template** to `src/components/<your-component>/` and rename the files.
2. **Build the component** following the Engineering Guidelines:
   - Lean, agnostic API (no business rules, no speculative props).
   - `forwardRef`, exported props interface.
   - Public `:global(.sd-<component>)` root class plus BEM-scoped element/modifier classes.
   - Semantic tokens only.
   - Full WAI-ARIA and keyboard handling.
3. **Tests** covering rendering, prop variants, interactions, ref forwarding, and at least one `vitest-axe` accessibility assertion.
4. **Stories** for every variant, state, and edge case (loading, disabled, error, empty, long content).
5. **Wire up the exports** in `src/index.ts` and add a per-component subpath in `package.json#exports`.
6. **Bundle-size budget** — add a `size-limit` entry for the new subpath.
7. **Add a changeset**:

   ```bash
   yarn changeset
   ```

   Pick `patch` for fixes, `minor` for additions, `major` for breaking changes.

8. **Open a PR.** CI runs lint, typecheck, tests, package verification, bundle-size, and a Storybook build. Branch protection on `main` requires all of them to pass.

[Changesets](https://github.com/changesets/changesets) is wired up for versioning and changelog entries — please add a changeset to any PR that affects published code. Automated publishing is parked until the library matures; the release workflow currently only runs on manual dispatch.

## License

[MIT](./LICENSE) © Guilherme Carvalho
