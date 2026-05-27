# Contributing to stud-components

Thanks for your interest in contributing. This document covers how to get set up and how to submit changes.

## Prerequisites

- Node.js 22+ (see `.nvmrc`). Use `nvm use` or any compatible version manager.
- Yarn 4 via Corepack:
  ```bash
  corepack enable
  ```

## Getting started

```bash
git clone https://github.com/guiooak/stud-components-react.git
cd stud-components-react
yarn install
yarn dev   # Storybook at http://localhost:6006
```

## Common scripts

| Command | What it does |
|---|---|
| `yarn dev` | Run Storybook locally |
| `yarn build` | Build the library to `dist/` |
| `yarn test` | Run the unit test suite once |
| `yarn test:watch` | Run tests in watch mode |
| `yarn test:coverage` | Run tests with coverage |
| `yarn typecheck` | Type-check without emitting |
| `yarn lint` / `yarn lint:fix` | ESLint |
| `yarn format` / `yarn format:check` | Prettier |
| `yarn verify-package` | Build + publint + attw |
| `yarn size` | Bundle-size budget check |

## Workflow

1. Create a topic branch off `main`.
2. Make your change with tests where appropriate.
3. Run `yarn lint`, `yarn typecheck`, `yarn test`, and `yarn format:check` locally.
4. **Add a changeset** (see below). PRs without a changeset will fail CI.
5. Open a pull request against `main`.

## Adding a new component

Every component is a copy-and-adapt of the reference template at `src/components/_template/`. See the [Contributing docs page](./src/docs/5-contributing.mdx) for the full walkthrough.

## Changesets

This project uses [Changesets](https://github.com/changesets/changesets) to manage versions and publish to npm. Every PR that affects published behavior must include a changeset.

```bash
yarn changeset
```

The CLI will ask you to pick a bump type and write a summary. It creates a markdown file under `.changeset/` — commit it alongside your change.

### Picking the bump type

While the library is in `0.x`, we follow the **0ver** convention:

| Change | Bump type | Example |
|---|---|---|
| Breaking change | `minor` | `0.1.0` → `0.2.0` |
| New feature | `patch` | `0.1.0` → `0.1.1` |
| Bug fix | `patch` | `0.1.0` → `0.1.1` |

`major` is reserved for the `0.x` → `1.0.0` graduation. After `1.0.0`, the project switches to standard SemVer.

### Internal-only PRs

If your PR is internal-only (refactor, docs, CI — no API surface change), add an empty changeset to satisfy the CI check:

```bash
yarn changeset --empty
```

## How releases happen

Releases are fully automated:

1. PRs land on `main` with their changesets.
2. The Changesets GitHub Action opens (and continuously updates) a "Version Packages" PR.
3. When a maintainer merges that PR, the action publishes to npm and creates a GitHub Release.

Maintainers never run `npm publish` manually.
