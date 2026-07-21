# Examples

Runnable scripts also live in [`/examples`](../examples/) in this repository.

## Basic GPA (Node / TypeScript)

```typescript
import { calculateGPA } from '@chuo-gpa/core';

const result = calculateGPA({
  courses: [
    { name: 'Database Security', credits: 10, grade: 'A' },
    { name: 'Software Engineering', credits: 10, grade: 'B+' },
    { name: 'Data Structures', credits: 10, grade: 'B' },
  ],
});

console.log(`GPA: ${result.gpa}`);
for (const course of result.courses) {
  console.log(
    `${course.name}: ${course.grade} (${course.gradePoint}) × ${course.credits} = ${course.qualityPoints}`,
  );
}
```

File: [`examples/basic-usage.ts`](../examples/basic-usage.ts)

## Multi-semester CGPA

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

console.log(result.cgpa, result.classification);
```

File: [`examples/multi-semester.ts`](../examples/multi-semester.ts)

## Custom university

```typescript
import { registerUniversity } from '@chuo-gpa/university-rules';
import { calculateGPA } from '@chuo-gpa/core';

registerUniversity({
  universityId: 'my-custom-uni',
  universityName: 'My Custom University',
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
});

const result = calculateGPA({
  universityId: 'my-custom-uni',
  courses: [
    { name: 'Physics', credits: 10, grade: 'A' },
    { name: 'Chemistry', credits: 10, grade: 'B' },
  ],
});
```

File: [`examples/custom-university.ts`](../examples/custom-university.ts)

## UDSM-only app

```typescript
import { calculateGPA, calculateCGPA, getClassification } from '@chuo-gpa/udsm';

const semester = calculateGPA({
  courses: [{ name: 'Database Security', credits: 10, grade: 'A' }],
});

const career = calculateCGPA({
  semesters: [{ name: 'Sem 1', courses: [{ name: 'DB', credits: 10, grade: 'A' }] }],
});

console.log(semester.gpa, getClassification(semester.gpa), career.classification);
```

## React + Vite (consumer app)

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm install @chuo-gpa/core
```

```tsx
import { calculateGPA } from '@chuo-gpa/core';

const result = calculateGPA({
  universityId: 'iaa',
  courses: [
    { name: 'Financial Accounting', credits: 10, grade: 'A' },
    { name: 'Business Law', credits: 8, grade: 'B+' },
  ],
});

export function Result() {
  return <p>Your GPA is {result.gpa.toFixed(2)}</p>;
}
```

See also the **My Final GPA** demo project at `../my-final-gpa` on your machine.
