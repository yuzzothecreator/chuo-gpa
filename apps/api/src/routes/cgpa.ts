import type { FastifyInstance } from 'fastify';
import { calculateCGPA } from '@chuo-gpa/core';
import { CGPARequestSchema } from '../schemas/index.js';
import { toSafeClientError } from '../lib/errors.js';

export async function cgpaRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/cgpa',
    {
      schema: {
        description: 'Calculate CGPA across multiple semesters',
        tags: ['CGPA'],
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            universityId: { type: 'string', maxLength: 64, description: 'University identifier' },
            semesters: {
              type: 'array',
              minItems: 1,
              maxItems: 40,
              items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: { type: 'string', maxLength: 100 },
                  year: { type: 'number' },
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
        request.log.warn({ err: error }, 'CGPA calculation failed');
        const safe = toSafeClientError(error);
        return reply.status(safe.status).send({
          success: false,
          error: safe.message,
        });
      }
    },
  );
}
