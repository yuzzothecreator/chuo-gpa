# Getting Started

This guide shows how to use Chuo-GPA as a developer in your own app (Node, React, Vite, Next.js, etc.).

## Requirements

- Node.js **20+**
- npm, pnpm, or yarn

## 1. Install

```bash
# npm
npm install @chuo-gpa/core

# pnpm
pnpm add @chuo-gpa/core

# yarn
yarn add @chuo-gpa/core
```

Optional university-specific packages (pre-bound to one school):

```bash
npm install @chuo-gpa/udsm
# or
npm install @chuo-gpa/udom
# or
npm install @chuo-gpa/iaa
```

## 2. Calculate GPA (core)

```typescript
import { calculateGPA } from '@chuo-gpa/core';

const result = calculateGPA({
  universityId: 'udsm', // optional — defaults to TCU standard
  courses: [
    { name: 'Database Security', credits: 10, grade: 'A' },
    { name: 'Software Engineering', credits: 10, grade: 'B+' },
    { name: 'Data Structures', credits: 10, grade: 'B' },
  ],
});

console.log(result.gpa); // e.g. 4.0
console.log(result.totalCredits); // 30
console.log(result.totalGradePoints); // quality points total
console.log(result.universityId); // "udsm"
console.log(result.courses); // per-course breakdown
```

### Course input shape

| Field     | Type     | Required | Description                                 |
| --------- | -------- | -------- | ------------------------------------------- |
| `name`    | `string` | Yes      | Course title                                |
| `credits` | `number` | Yes      | Credit hours (must be > 0)                  |
| `grade`   | `string` | Yes      | Letter grade: `A`, `B+`, `B`, `C`, `D`, `F` |
| `score`   | `number` | No       | Percentage 0–100 (optional helper)          |

## 3. University-specific package

If your app is only for one university, use the convenience package so you never pass `universityId`:

```typescript
import { calculateGPA, getClassification } from '@chuo-gpa/udsm';

const result = calculateGPA({
  courses: [{ name: 'Programming I', credits: 10, grade: 'A' }],
});

console.log(result.gpa);
console.log(getClassification(result.gpa)); // e.g. "First Class"
```

Same pattern for `@chuo-gpa/udom` and `@chuo-gpa/iaa`.

## 4. Calculate CGPA (multiple semesters)

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
console.log(result.semesters); // per-semester GPAs
```

## 5. Degree classification

```typescript
import { getClassification } from '@chuo-gpa/core';

getClassification(4.5); // "First Class"
getClassification(3.8, 'udsm'); // "Upper Second Class"
getClassification(1.5); // "Fail"
```

## 6. Grade conversion

```typescript
import { gradeToPoint, scoreToGrade, convertGrade } from '@chuo-gpa/core';

gradeToPoint('A'); // 5.0
gradeToPoint('B+', 'udsm'); // 4.0

scoreToGrade(85); // { grade: 'A', gradePoint: 5.0, minScore: 70, maxScore: 100 }

convertGrade('A'); // grade scale entry
convertGrade(72); // same via score
```

## 7. Use in React (demo pattern)

```tsx
import { useState } from 'react';
import { calculateGPA, getClassification } from '@chuo-gpa/core';

function GpaForm() {
  const [gpa, setGpa] = useState<number | null>(null);

  function onCalculate() {
    const result = calculateGPA({
      universityId: 'udsm',
      courses: [
        { name: 'Database Security', credits: 10, grade: 'A' },
        { name: 'Software Engineering', credits: 10, grade: 'B+' },
      ],
    });
    setGpa(result.gpa);
    console.log(getClassification(result.gpa, 'udsm'));
  }

  return (
    <div>
      <button type="button" onClick={onCalculate}>
        Calculate
      </button>
      {gpa !== null && <p>GPA: {gpa.toFixed(2)}</p>}
    </div>
  );
}
```

A full working demo app lives beside this repo as **My Final GPA** (`../my-final-gpa`), which installs `@chuo-gpa/core` from npm.

## Next steps

- [Package API reference](./package-api.md)
- [Universities & scales](./universities.md)
- [REST API](./rest-api.md)
- [More examples](./examples.md)
