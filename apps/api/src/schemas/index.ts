import { z } from 'zod';

/**
 * Schema for a single course input.
 */
export const CourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  credits: z.number().positive('Credits must be greater than 0'),
  grade: z.string().min(1, 'Grade is required'),
  score: z.number().min(0).max(100).optional(),
});

/**
 * Schema for GPA calculation request.
 */
export const GPARequestSchema = z.object({
  universityId: z.string().optional(),
  courses: z.array(CourseSchema).min(1, 'At least one course is required'),
});

/**
 * Schema for a semester input.
 */
export const SemesterSchema = z.object({
  name: z.string().optional(),
  year: z.number().optional(),
  courses: z.array(CourseSchema).min(1, 'At least one course is required'),
});

/**
 * Schema for CGPA calculation request.
 */
export const CGPARequestSchema = z.object({
  universityId: z.string().optional(),
  semesters: z.array(SemesterSchema).min(1, 'At least one semester is required'),
});

/**
 * Schema for classification request.
 */
export const ClassifyRequestSchema = z.object({
  gpa: z.number().min(0).max(5),
  universityId: z.string().optional(),
});

// Type inference
export type GPARequest = z.infer<typeof GPARequestSchema>;
export type CGPARequest = z.infer<typeof CGPARequestSchema>;
export type ClassifyRequest = z.infer<typeof ClassifyRequestSchema>;
