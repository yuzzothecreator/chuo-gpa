import { registerUniversity, getUniversityRule } from '@chuo-gpa/university-rules';
import { calculateGPA } from '@chuo-gpa/core';
import type { UniversityGradingRule } from '@chuo-gpa/types';

console.log('--- Custom University Registration ---');

// 1. Define a custom university rule
// Let's pretend this university uses a 4.0 scale
const myCustomUni: UniversityGradingRule = {
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
};

// 2. Register the rule
registerUniversity(myCustomUni);
console.log('Successfully registered: ' + getUniversityRule('my-custom-uni').universityName);

// 3. Use the custom university in a calculation
const result = calculateGPA({
  universityId: 'my-custom-uni',
  courses: [
    { name: 'Physics', credits: 10, grade: 'A' }, // 4.0 pts in our custom scale
    { name: 'Chemistry', credits: 10, grade: 'B' }, // 3.0 pts
  ],
});

console.log(`\nCalculated GPA using custom scale: ${result.gpa}`); // Should be 3.5
console.log(`Grade points for A: ${result.courses[0]?.gradePoint}`); // 4.0
console.log(`Grade points for B: ${result.courses[1]?.gradePoint}`); // 3.0
