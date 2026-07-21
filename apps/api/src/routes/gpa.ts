import type { FastifyInstance } from 'fastify';
import { calculateGPA } from '@chuo-gpa/core';
import { GPARequestSchema } from '../schemas/index.js';

export async function gpaRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/gpa',
    {
      schema: {
        description: 'Calculate GPA for a set of courses',
        tags: ['GPA'],
        body: {
          type: 'object',
          properties: {
            universityId: {
              type: 'string',
              description: 'University identifier (e.g., "udsm", "udom", "iaa")',
            },
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
        const parsed = GPARequestSchema.parse(request.body);
        const result = calculateGPA(parsed);

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
