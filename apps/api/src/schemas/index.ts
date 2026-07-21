import { z } from 'zod';

const MAX_COURSES = 100;
const MAX_SEMESTERS = 40;
const MAX_CREDITS = 100;
const MAX_NAME = 200;

/**
 * Schema for a single course input.
 */
export const CourseSchema = z.object({
  name: z.string().trim().min(1, 'Course name is required').max(MAX_NAME),
  credits: z
    .number()
    .finite('Credits must be a finite number')
    .positive('Credits must be greater than 0')
    .max(MAX_CREDITS, `Credits must be at most ${MAX_CREDITS}`),
  grade: z.string().trim().min(1, 'Grade is required').max(10),
  score: z.number().finite().min(0).max(100).optional(),
});

/**
 * Schema for GPA calculation request.
 */
export const GPARequestSchema = z.object({
  universityId: z.string().trim().min(1).max(64).optional(),
  courses: z
    .array(CourseSchema)
    .min(1, 'At least one course is required')
    .max(MAX_COURSES, `At most ${MAX_COURSES} courses are allowed`),
});

/**
 * Schema for a semester input.
 */
export const SemesterSchema = z.object({
  name: z.string().trim().max(100).optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  courses: z
    .array(CourseSchema)
    .min(1, 'At least one course is required')
    .max(MAX_COURSES, `At most ${MAX_COURSES} courses are allowed`),
});

/**
 * Schema for CGPA calculation request.
 */
export const CGPARequestSchema = z.object({
  universityId: z.string().trim().min(1).max(64).optional(),
  semesters: z
    .array(SemesterSchema)
    .min(1, 'At least one semester is required')
    .max(MAX_SEMESTERS, `At most ${MAX_SEMESTERS} semesters are allowed`),
});

/**
 * Schema for classification request.
 */
export const ClassifyRequestSchema = z.object({
  gpa: z.number().finite().min(0).max(5),
  universityId: z.string().trim().min(1).max(64).optional(),
});

export type GPARequest = z.infer<typeof GPARequestSchema>;
export type CGPARequest = z.infer<typeof CGPARequestSchema>;
export type ClassifyRequest = z.infer<typeof ClassifyRequestSchema>;
