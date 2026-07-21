# Package API Reference

## `@chuo-gpa/core`

Main calculation engine. Import from here in most apps.

```typescript
import {
  calculateGPA,
  calculateCGPA,
  getClassification,
  classify,
  gradeToPoint,
  scoreToGrade,
  convertGrade,
  calculateTotalCredits,
  calculateQualityPoints,
} from '@chuo-gpa/core';
```

### `calculateGPA(input)`

**Input (`GPAInput`)**

```typescript
{
  universityId?: string; // "udsm" | "udom" | "iaa" | custom id
  courses: Array<{
    name: string;
    credits: number;
    grade: string;
    score?: number;
  }>;
}
```

**Returns (`GPAResult`)**

```typescript
{
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
  courses: Array<{
    name: string;
    credits: number;
    grade: string;
    gradePoint: number;
    qualityPoints: number; // gradePoint × credits
  }>;
  universityId: string;
}
```

**Formula**

\[
\text{GPA} = \frac{\sum (\text{gradePoint} \times \text{credits})}{\sum \text{credits}}
\]

### `calculateCGPA(input)`

**Input (`CGPAInput`)**

```typescript
{
  universityId?: string;
  semesters: Array<{
    name?: string;
    year?: number;
    courses: CourseInput[];
  }>;
}
```

**Returns (`CGPAResult`)**

```typescript
{
  cgpa: number;
  totalCredits: number;
  totalGradePoints: number;
  semesters: SemesterResult[];
  classification: DegreeClassification;
  universityId: string;
}
```

### `getClassification(gpa, universityId?)`

Returns a degree classification string for the given GPA.

Alias: `classify(gpa, universityId?)`

**Possible values** (`DegreeClassification`):

- `"First Class"`
- `"Upper Second Class"`
- `"Lower Second Class"`
- `"Pass"`
- `"Fail"`

### `gradeToPoint(grade, universityId?)`

Converts a letter grade to its numeric point (e.g. `"A"` → `5.0`).

Throws if the grade is not in the university scale.

### `scoreToGrade(score, universityId?)`

Converts a percentage (0–100) to a full grade scale entry.

Throws if score is outside 0–100.

### `convertGrade(input, universityId?)`

Accepts either a letter grade (`string`) or a score (`number`) and returns the grade scale entry.

### `calculateTotalCredits(courses)` / `calculateQualityPoints(courses)`

Low-level helpers used internally; available if you need partial calculations.

---

## `@chuo-gpa/udsm` · `@chuo-gpa/udom` · `@chuo-gpa/iaa`

Convenience wrappers. Same methods, university already set:

```typescript
import {
  calculateGPA,
  calculateCGPA,
  getClassification,
  gradeToPoint,
} from '@chuo-gpa/udsm';
```

| Function | Notes |
| -------- | ----- |
| `calculateGPA({ courses })` | No `universityId` needed |
| `calculateCGPA({ semesters })` | No `universityId` needed |
| `getClassification(gpa)` | Uses that university’s bands |
| `gradeToPoint(grade)` | Uses that university’s scale |

---

## `@chuo-gpa/university-rules`

Registry of grading rules.

```typescript
import {
  getUniversityRule,
  listUniversities,
  registerUniversity,
  hasUniversity,
  getDefaultRule,
  DEFAULT_UNIVERSITY_ID,
} from '@chuo-gpa/university-rules';
```

| Function | Description |
| -------- | ----------- |
| `listUniversities()` | List registered university IDs / metadata |
| `getUniversityRule(id)` | Get full grading rule |
| `hasUniversity(id)` | `true` if registered |
| `registerUniversity(rule)` | Add a custom university at runtime |
| `getDefaultRule()` | Default (TCU-style) rule |
| `DEFAULT_UNIVERSITY_ID` | Default id constant |

### Custom university example

```typescript
import { registerUniversity } from '@chuo-gpa/university-rules';
import { calculateGPA } from '@chuo-gpa/core';
import type { UniversityGradingRule } from '@chuo-gpa/types';

const rule: UniversityGradingRule = {
  universityId: 'my-uni',
  universityName: 'My University',
  maxGPA: 4.0,
  gradeScale: [
    { grade: 'A', gradePoint: 4.0, minScore: 80, maxScore: 100 },
    { grade: 'B', gradePoint: 3.0, minScore: 70, maxScore: 79 },
    { grade: 'C', gradePoint: 2.0, minScore: 60, maxScore: 69 },
    { grade: 'D', gradePoint: 1.0, minScore: 50, maxScore: 59 },
    { grade: 'F', gradePoint: 0.0, minScore: 0, maxScore: 49 },
  ],
  classificationScale: [
    { classification: 'First Class', minGPA: 3.6, maxGPA: 4.0 },
    { classification: 'Upper Second Class', minGPA: 3.0, maxGPA: 3.59 },
    { classification: 'Lower Second Class', minGPA: 2.5, maxGPA: 2.99 },
    { classification: 'Pass', minGPA: 2.0, maxGPA: 2.49 },
  ],
};

registerUniversity(rule);

const result = calculateGPA({
  universityId: 'my-uni',
  courses: [
    { name: 'Physics', credits: 10, grade: 'A' },
    { name: 'Chemistry', credits: 10, grade: 'B' },
  ],
});
```

---

## `@chuo-gpa/types`

Shared TypeScript types. Usually you import types from `@chuo-gpa/core` (re-exported). Direct import:

```typescript
import type {
  CourseInput,
  GPAInput,
  GPAResult,
  CGPAInput,
  CGPAResult,
  UniversityGradingRule,
  DegreeClassification,
} from '@chuo-gpa/types';
```

---

## Errors

Common thrown errors:

| Situation | Example message |
| --------- | --------------- |
| Invalid letter grade | `Grade "Z" not found in ... Valid grades: A, B+, ...` |
| Score out of range | `Score must be between 0 and 100` |
| Unknown university | Thrown by registry when id is missing |
| Empty / invalid credits | Validation errors from utils / API schemas |

Always wrap calculations in `try/catch` in UI apps.
