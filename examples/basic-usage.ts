import { calculateGPA } from '@chuo-gpa/core';

// 1. Basic Calculation using TCU Standard
console.log('--- Basic GPA Calculation ---');
const basicResult = calculateGPA({
  courses: [
    { name: 'Database Security', credits: 10, grade: 'A' },
    { name: 'Software Engineering', credits: 10, grade: 'B+' },
    { name: 'Data Structures', credits: 10, grade: 'B' },
  ],
});

console.log(`GPA: ${basicResult.gpa}`);
console.log(`Total Credits: ${basicResult.totalCredits}`);
console.log(`Total Grade Points: ${basicResult.totalGradePoints}`);

// 2. Output detailed breakdown
console.log('\n--- Course Breakdown ---');
for (const course of basicResult.courses) {
  console.log(
    `${course.name}: Grade ${course.grade} (${course.gradePoint} pts) × ${course.credits} credits = ${course.qualityPoints} quality pts`,
  );
}
