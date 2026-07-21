# Supported Universities

Chuo-GPA ships with three Tanzanian universities plus a TCU-style default scale.

| University | ID | npm package |
| ---------- | -- | ----------- |
| University of Dar es Salaam | `udsm` | [`@chuo-gpa/udsm`](https://www.npmjs.com/package/@chuo-gpa/udsm) |
| University of Dodoma | `udom` | [`@chuo-gpa/udom`](https://www.npmjs.com/package/@chuo-gpa/udom) |
| Institute of Accountancy Arusha | `iaa` | [`@chuo-gpa/iaa`](https://www.npmjs.com/package/@chuo-gpa/iaa) |

Use the `universityId` with `@chuo-gpa/core`, or install the university package for pre-bound helpers.

## Grading scale (TCU standard / default)

Used when `universityId` is omitted or for the built-in Tanzanian 5.0 scale:

| Grade | Grade point | Score range |
| ----- | ----------- | ----------- |
| A | 5.0 | 70–100% |
| B+ | 4.0 | 60–69% |
| B | 3.0 | 50–59% |
| C | 2.0 | 40–49% |
| D | 1.0 | 35–39% |
| F | 0.0 | 0–34% |

Maximum GPA: **5.0**

## Degree classification

| Classification | GPA range |
| -------------- | --------- |
| First Class | 4.4 – 5.0 |
| Upper Second Class | 3.5 – 4.3 |
| Lower Second Class | 2.7 – 3.4 |
| Pass | 2.0 – 2.6 |
| Fail | below 2.0 |

Exact bands come from each university’s `classificationScale` in `@chuo-gpa/university-rules`. Always use `getClassification(gpa, universityId)` for the official label.

## List rules in code

```typescript
import { listUniversities, getUniversityRule } from '@chuo-gpa/university-rules';

console.log(listUniversities());

const udsm = getUniversityRule('udsm');
console.log(udsm.universityName);
console.log(udsm.gradeScale);
console.log(udsm.classificationScale);
```

## Adding another university

See [Package API → Custom university](./package-api.md#custom-university-example) or register a rule in `packages/university-rules` when contributing to this repo.
