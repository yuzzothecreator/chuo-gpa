<p align="center">
  <h1 align="center">CHUO-GPA</h1>
  <p align="center">
    <strong>The Academic Calculation Engine for Tanzanian Universities</strong>
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@chuo-gpa/core"><img alt="npm" src="https://img.shields.io/npm/v/@chuo-gpa/core.svg" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-green.svg" /></a>
  <a href="./docs/README.md"><img alt="Docs" src="https://img.shields.io/badge/docs-guide-0B3D2E" /></a>
</p>

<p align="center">
  <a href="./docs/getting-started.md">Getting Started</a> ·
  <a href="./docs/package-api.md">API Reference</a> ·
  <a href="./docs/universities.md">Universities</a> ·
  <a href="./docs/rest-api.md">REST API</a> ·
  <a href="./docs/examples.md">Examples</a>
</p>

---

## What is Chuo-GPA?

**Chuo-GPA** is a free, open-source TypeScript toolkit for calculating **GPA**, **CGPA**, **degree classification**, and **grade conversion** using Tanzanian university grading rules.

Use it in:

- Student portals & university systems
- Mobile / web apps
- Learning management systems
- Education startups

### Full documentation

Everything you need lives in the **[`docs/`](./docs/README.md)** folder:

| Guide                       | Link                                         |
| --------------------------- | -------------------------------------------- |
| Install & first calculation | [Getting Started](./docs/getting-started.md) |
| Functions, inputs, returns  | [Package API](./docs/package-api.md)         |
| UDSM / UDOM / IAA scales    | [Universities](./docs/universities.md)       |
| HTTP server endpoints       | [REST API](./docs/rest-api.md)               |
| Copy-paste samples          | [Examples](./docs/examples.md)               |
| Develop this repo           | [Contributing](./docs/contributing.md)       |

---

## Features

- **GPA** — weighted grade point average
- **CGPA** — cumulative GPA across semesters
- **Classification** — First Class, Upper Second, Lower Second, Pass, Fail
- **Grade conversion** — letter ↔ points ↔ percentage
- **Multi-university** — UDSM, UDOM, IAA (+ custom rules)
- **REST API** — Fastify + Swagger
- **TypeScript** — full types on npm
- **MIT licensed** — free for any project

---

## Installation

Packages are published on npm (`0.1.0+`):

```bash
npm install @chuo-gpa/core

# Optional university helpers
npm install @chuo-gpa/udsm
# npm install @chuo-gpa/udom
# npm install @chuo-gpa/iaa
```

Also works with `pnpm add` / `yarn add`.

---

## Quick start

### Calculate GPA

```typescript
import { calculateGPA } from '@chuo-gpa/core';

const result = calculateGPA({
  universityId: 'udsm',
  courses: [
    { name: 'Database Security', credits: 10, grade: 'A' },
    { name: 'Software Engineering', credits: 10, grade: 'B+' },
    { name: 'Data Structures', credits: 10, grade: 'B' },
  ],
});

console.log(result.gpa); // e.g. 4.0
console.log(result.totalCredits); // 30
console.log(result.courses); // per-course breakdown
```

### Calculate CGPA

```typescript
import { calculateCGPA } from '@chuo-gpa/core';

const result = calculateCGPA({
  universityId: 'udsm',
  semesters: [
    {
      name: 'Year 1 Semester 1',
      courses: [
        { name: 'Programming I', credits: 10, grade: 'A' },
        { name: 'Mathematics I', credits: 10, grade: 'B+' },
      ],
    },
    {
      name: 'Year 1 Semester 2',
      courses: [
        { name: 'Programming II', credits: 10, grade: 'B+' },
        { name: 'Mathematics II', credits: 10, grade: 'A' },
      ],
    },
  ],
});

console.log(result.cgpa);
console.log(result.classification); // e.g. "First Class"
```

### University-specific package

```typescript
import { calculateGPA, getClassification } from '@chuo-gpa/udsm';

const result = calculateGPA({
  courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
});

console.log(result.gpa);
console.log(getClassification(result.gpa));
```

More samples: [docs/examples.md](./docs/examples.md) and [`examples/`](./examples/).

---

## Supported universities

| University                      | ID     | Package                                                          |
| ------------------------------- | ------ | ---------------------------------------------------------------- |
| University of Dar es Salaam     | `udsm` | [`@chuo-gpa/udsm`](https://www.npmjs.com/package/@chuo-gpa/udsm) |
| University of Dodoma            | `udom` | [`@chuo-gpa/udom`](https://www.npmjs.com/package/@chuo-gpa/udom) |
| Institute of Accountancy Arusha | `iaa`  | [`@chuo-gpa/iaa`](https://www.npmjs.com/package/@chuo-gpa/iaa)   |

### Grading scale (TCU standard)

| Grade | Point | Score   |
| ----- | ----- | ------- |
| A     | 5.0   | 70–100% |
| B+    | 4.0   | 60–69%  |
| B     | 3.0   | 50–59%  |
| C     | 2.0   | 40–49%  |
| D     | 1.0   | 35–39%  |
| F     | 0.0   | 0–34%   |

### Degree classification

| Classification     | GPA       |
| ------------------ | --------- |
| First Class        | 4.4 – 5.0 |
| Upper Second Class | 3.5 – 4.3 |
| Lower Second Class | 2.7 – 3.4 |
| Pass               | 2.0 – 2.6 |

Details: [docs/universities.md](./docs/universities.md).

---

## npm packages

| Package                                                                                  | Role           |
| ---------------------------------------------------------------------------------------- | -------------- |
| [`@chuo-gpa/core`](https://www.npmjs.com/package/@chuo-gpa/core)                         | Main engine    |
| [`@chuo-gpa/types`](https://www.npmjs.com/package/@chuo-gpa/types)                       | Shared types   |
| [`@chuo-gpa/university-rules`](https://www.npmjs.com/package/@chuo-gpa/university-rules) | Rules registry |
| [`@chuo-gpa/utils`](https://www.npmjs.com/package/@chuo-gpa/utils)                       | Utilities      |
| [`@chuo-gpa/udsm`](https://www.npmjs.com/package/@chuo-gpa/udsm)                         | UDSM helpers   |
| [`@chuo-gpa/udom`](https://www.npmjs.com/package/@chuo-gpa/udom)                         | UDOM helpers   |
| [`@chuo-gpa/iaa`](https://www.npmjs.com/package/@chuo-gpa/iaa)                           | IAA helpers    |

---

## REST API

```bash
pnpm install
pnpm build
pnpm --filter @chuo-gpa/api dev
```

| Method | Endpoint                   | Description       |
| ------ | -------------------------- | ----------------- |
| `POST` | `/api/v1/gpa`              | Calculate GPA     |
| `POST` | `/api/v1/cgpa`             | Calculate CGPA    |
| `POST` | `/api/v1/classify`         | Classify a GPA    |
| `GET`  | `/api/v1/universities`     | List universities |
| `GET`  | `/api/v1/universities/:id` | University rules  |
| `GET`  | `/api/v1/health`           | Health check      |
| `GET`  | `/docs`                    | Swagger UI        |

Full guide: [docs/rest-api.md](./docs/rest-api.md).

---

## Monorepo structure

```
chuo-gpa/
├── apps/api/              # Fastify REST API
├── packages/
│   ├── core/              # Calculation engine
│   ├── types/             # Shared types
│   ├── university-rules/  # Grading rules
│   ├── utils/             # Utilities
│   ├── udsm/ udom/ iaa/   # Convenience packages
├── examples/              # Usage scripts
├── docs/                  # Full documentation
└── README.md
```

---

## Development

```bash
pnpm install
pnpm build
pnpm check          # format + lint + typecheck + build + tests
pnpm --filter @chuo-gpa/api dev
```

See [docs/contributing.md](./docs/contributing.md).

---

## License

MIT © [Chuo-GPA Contributors](./LICENSE)
