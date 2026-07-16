import { calculateCGPA } from '@chuo-gpa/core';
import type { CGPAInput } from '@chuo-gpa/types';

console.log('--- Multi-Semester CGPA Calculation ---');

const input: CGPAInput = {
  universityId: 'udsm',
  semesters: [
    {
      name: 'Year 1 Semester 1',
      courses: [
        { name: 'Programming I', credits: 10, grade: 'A' },
        { name: 'Mathematics I', credits: 10, grade: 'B+' },
        { name: 'Communication Skills', credits: 5, grade: 'A' },
      ],
    },
    {
      name: 'Year 1 Semester 2',
      courses: [
        { name: 'Programming II', credits: 10, grade: 'B+' },
        { name: 'Mathematics II', credits: 10, grade: 'A' },
        { name: 'Development Studies', credits: 5, grade: 'B' },
      ],
    },
  ],
};

const result = calculateCGPA(input);

console.log(`\nUniversity: ${result.universityId}`);
console.log(`Cumulative GPA: ${result.cgpa}`);
console.log(`Degree Classification: ${result.classification}`);
console.log(`Total Credits: ${result.totalCredits}`);

console.log('\n--- Semester Breakdown ---');
result.semesters.forEach((sem, i) => {
  console.log(`\n${sem.name || `Semester ${i + 1}`}`);
  console.log(`Semester GPA: ${sem.gpa}`);
  console.log(`Credits: ${sem.totalCredits}`);
});
