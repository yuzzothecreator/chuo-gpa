import type { FastifyInstance } from 'fastify';
import { getClassification } from '@chuo-gpa/core';
import { ClassifyRequestSchema } from '../schemas/index.js';

export async function classifyRoutes(app: FastifyInstance): Promise<void> {
  app.post(
    '/classify',
    {
      schema: {
        description: 'Get degree classification for a GPA value',
        tags: ['Classification'],
        body: {
          type: 'object',
          properties: {
            gpa: { type: 'number', description: 'GPA value (0.0–5.0)' },
            universityId: { type: 'string', description: 'University identifier' },
          },
          required: ['gpa'],
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  gpa: { type: 'number' },
                  classification: { type: 'string' },
                  universityId: { type: 'string' },
                },
              },
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
        const parsed = ClassifyRequestSchema.parse(request.body);
        const classification = getClassification(parsed.gpa, parsed.universityId);

        return reply.status(200).send({
          success: true,
          data: {
            gpa: parsed.gpa,
            classification,
            universityId: parsed.universityId ?? 'tcu-standard',
          },
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
