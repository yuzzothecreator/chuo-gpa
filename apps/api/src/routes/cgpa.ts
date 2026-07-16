import type { FastifyInstance } from 'fastify';
import { calculateCGPA } from '@chuo-gpa/core';
import { CGPARequestSchema } from '../schemas/index.js';

export async function cgpaRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/cgpa',
    {
      schema: {
        description: 'Calculate CGPA across multiple semesters',
        tags: ['CGPA'],
        body: {
          type: 'object',
          properties: {
            universityId: { type: 'string', description: 'University identifier' },
            semesters: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  year: { type: 'number' },
                  courses: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        name: { type: 'string' },
                        credits: { type: 'number' },
                        grade: { type: 'string' },
                        score: { type: 'number' },
                      },
                      required: ['name', 'credits', 'grade'],
                    },
                  },
                },
                required: ['courses'],
              },
            },
          },
          required: ['semesters'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { type: 'object' },
            },
          },
          400: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              error: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const parsed = CGPARequestSchema.parse(request.body);
        const result = calculateCGPA(parsed);

        return reply.status(200).send({
          success: true,
          data: result,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return reply.status(400).send({
          success: false,
          error: message,
        });
      }
    },
  );
}
