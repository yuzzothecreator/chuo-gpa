import type { FastifyInstance } from 'fastify';
import { calculateGPA } from '@chuo-gpa/core';
import { GPARequestSchema } from '../schemas/index.js';
import { toSafeClientError } from '../lib/errors.js';

export async function gpaRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/gpa',
    {
      schema: {
        description: 'Calculate GPA for a set of courses',
        tags: ['GPA'],
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            universityId: {
              type: 'string',
              maxLength: 64,
              description: 'University identifier (e.g., "udsm", "udom", "iaa")',
            },
            courses: {
              type: 'array',
              minItems: 1,
              maxItems: 100,
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 200 },
                  credits: { type: 'number', exclusiveMinimum: 0, maximum: 100 },
                  grade: { type: 'string', minLength: 1, maxLength: 10 },
                  score: { type: 'number', minimum: 0, maximum: 100 },
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
        request.log.warn({ err: error }, 'GPA calculation failed');
        const safe = toSafeClientError(error);
        return reply.status(safe.status).send({
          success: false,
          error: safe.message,
        });
      }
    },
  );
}
