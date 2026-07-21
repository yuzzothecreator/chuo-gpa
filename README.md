<p align="center">
  <h1 align="center">🎓 CHUO-GPA</h1>
  <p align="center">
    <strong>The Academic Calculation Engine for Tanzanian Universities</strong>
  </p>
</p>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#supported-universities">Universities</a> •
  <a href="#api">API</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## What is Chuo-GPA?

**Chuo-GPA** is a free, open-source developer package and API for calculating GPA, CGPA, degree classification, and academic performance according to different university grading systems in Tanzania.

Built for developers integrating into:

- 🏫 Student portals & university systems
- 📱 Mobile applications
- 📚 Learning management systems
- 🚀 Education startups

## Features

- ✅ **GPA Calculation** — Weighted grade point average
- ✅ **CGPA Calculation** — Cumulative GPA across semesters
- ✅ **Degree Classification** — First Class, Upper Second, Lower Second, Pass
- ✅ **Grade Conversion** — Letter grades ↔ grade points ↔ percentage scores
- ✅ **Multi-University Support** — UDSM, UDOM, IAA (and extensible)
- ✅ **REST API** — Fastify-based API with Swagger documentation
- ✅ **TypeScript** — Full type safety and IntelliSense support
- ✅ **Zero Dependencies** — Core engine has no runtime dependencies

## Installation

```bash
# Install the core package
pnpm add @chuo-gpa/core

# Or use a university-specific package
pnpm add @chuo-gpa/udsm
pnpm add @chuo-gpa/udom
pnpm add @chuo-gpa/iaa
```

## Quick Start

### Calculate GPA

```typescript
import { calculateGPA } from '@chuo-gpa/core';

const result = calculateGPA({
  courses: [
    { name: 'Database Security', credits: 10, grade: 'A' },
    { name: 'Software Engineering', credits: 10, grade: 'B+' },
    { name: 'Data Structures', credits: 10, grade: 'B' },
  ],
});

console.log(result.gpa); // 4.0
console.log(result.totalCredits); // 30
console.log(result.courses); // Detailed per-course breakdown
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

console.log(result.cgpa); // 4.5
console.log(result.classification); // "First Class"
```

### University-Specific Package

```typescript
import { calculateGPA } from '@chuo-gpa/udsm';

// No need to specify universityId — pre-bound to UDSM
const result = calculateGPA({
  courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
});
```

## Supported Universities

| University                      | ID     | Package          |
| ------------------------------- | ------ | ---------------- |
| University of Dar es Salaam     | `udsm` | `@chuo-gpa/udsm` |
| University of Dodoma            | `udom` | `@chuo-gpa/udom` |
| Institute of Accountancy Arusha | `iaa`  | `@chuo-gpa/iaa`  |

### Grading Scale (TCU Standard)

| Grade | Grade Point | Score Range |
| ----- | ----------- | ----------- |
| A     | 5.0         | 70–100%     |
| B+    | 4.0         | 60–69%      |
| B     | 3.0         | 50–59%      |
| C     | 2.0         | 40–49%      |
| D     | 1.0         | 35–39%      |
| F     | 0.0         | 0–34%       |

### Degree Classification

| Classification     | GPA Range |
| ------------------ | --------- |
| First Class        | 4.4 – 5.0 |
| Upper Second Class | 3.5 – 4.3 |
| Lower Second Class | 2.7 – 3.4 |
| Pass               | 2.0 – 2.6 |

## REST API

Start the API server:

```bash
pnpm --filter api dev
```

### Endpoints

| Method | Endpoint                   | Description                  |
| ------ | -------------------------- | ---------------------------- |
| `POST` | `/api/v1/gpa`              | Calculate GPA                |
| `POST` | `/api/v1/cgpa`             | Calculate CGPA               |
| `POST` | `/api/v1/classify`         | Get degree classification    |
| `GET`  | `/api/v1/universities`     | List supported universities  |
| `GET`  | `/api/v1/universities/:id` | Get university grading rules |
| `GET`  | `/api/v1/health`           | Health check                 |
| `GET`  | `/docs`                    | Swagger UI documentation     |

### Example Request

```bash
curl -X POST http://localhost:3000/api/v1/gpa \
  -H "Content-Type: application/json" \
  -d '{
    "universityId": "udsm",
    "courses": [
      { "name": "Database Security", "credits": 10, "grade": "A" },
      { "name": "Software Engineering", "credits": 10, "grade": "B+" }
    ]
  }'
```

## Monorepo Structure

```
chuo-gpa/
├── apps/
│   ├── api/                    # Fastify REST API
│   └── documentation/          # TypeDoc documentation
├── packages/
│   ├── core/                   # Main calculation engine
│   ├── types/                  # Shared TypeScript types
│   ├── university-rules/       # University grading rules registry
│   ├── utils/                  # Shared utilities
│   ├── udsm/                   # UDSM convenience package
│   ├── udom/                   # UDOM convenience package
│   └── iaa/                    # IAA convenience package
├── tests/                      # Integration tests
├── examples/                   # Usage examples
└── README.md
```

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format

# Start API dev server
pnpm --filter api dev
```

## Adding a New University

1. Create a grading rule in `packages/university-rules/src/rules/`:

```typescript
import type { UniversityGradingRule } from '@chuo-gpa/types';

export const myUniversityRule: UniversityGradingRule = {
  universityId: 'my-uni',
  universityName: 'My University',
  maxGPA: 5.0,
  gradeScale: [
    { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 },
    // ... add all grades
  ],
  classificationScale: [
    { classification: 'First Class', minGPA: 4.4, maxGPA: 5.0 },
    // ... add all classifications
  ],
};
```

2. Register it in the registry.

Or use the runtime API:

```typescript
import { registerUniversity } from '@chuo-gpa/university-rules';

registerUniversity({
  universityId: 'custom-uni',
  universityName: 'Custom University',
  // ... full rule definition
});
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## License

MIT © [Chuo-GPA Contributors](LICENSE)
