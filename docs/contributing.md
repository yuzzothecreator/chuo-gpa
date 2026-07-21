# Contributing

Thanks for helping improve Chuo-GPA.

## Setup

```bash
git clone https://github.com/<your-org>/chuo-gpa.git
cd chuo-gpa
pnpm install
pnpm build
pnpm check
```

`pnpm check` runs format, lint, typecheck, build, and tests with coverage.

## Monorepo layout

```
chuo-gpa/
├── apps/api/                 # Fastify REST API
├── packages/
│   ├── core/                 # Calculation engine
│   ├── types/                # Shared types
│   ├── university-rules/     # Grading rules registry
│   ├── utils/                # Helpers
│   ├── udsm/ udom/ iaa/      # Convenience packages
├── examples/                 # Usage scripts
├── docs/                     # This documentation
└── .github/workflows/        # CI + release
```

## Scripts

| Command                           | Purpose                     |
| --------------------------------- | --------------------------- |
| `pnpm build`                      | Build all packages          |
| `pnpm test`                       | Run tests                   |
| `pnpm test:coverage`              | Tests + coverage thresholds |
| `pnpm typecheck`                  | TypeScript check            |
| `pnpm lint`                       | ESLint                      |
| `pnpm format`                     | Prettier write              |
| `pnpm check`                      | Full quality gate           |
| `pnpm --filter @chuo-gpa/api dev` | Start API                   |

## Pull requests

1. Create a branch from `main`
2. Make focused changes
3. Add/update tests under `packages/core/__tests__`
4. Run `pnpm check`
5. Open a PR with a short summary and test notes

For version bumps, use Changesets:

```bash
pnpm changeset
```

CI on `main` can open a release PR / publish via Changesets when `NPM_TOKEN` is configured.

## Adding a university (in-repo)

1. Add `packages/university-rules/src/rules/my-uni.ts`
2. Register it in `packages/university-rules/src/registry.ts`
3. Optionally add `packages/my-uni` convenience package mirroring `udsm`
4. Document it in [universities.md](./universities.md)
5. Add tests

## License

MIT — see [LICENSE](../LICENSE).
