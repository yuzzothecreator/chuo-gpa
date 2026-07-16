import type { FastifyInstance } from 'fastify';
import { listUniversities, getUniversityRule, hasUniversity } from '@chuo-gpa/university-rules';

export async function universityRoutes(app: FastifyInstance): Promise<void> {
  // List all universities
  app.get(
    '/universities',
    {
      schema: {
        description: 'List all supported universities and their grading rules',
        tags: ['Universities'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    universityId: { type: 'string' },
                    universityName: { type: 'string' },
                    maxGPA: { type: 'number' },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (_request, reply) => {
      const universities = listUniversities().map((u) => ({
        universityId: u.universityId,
        universityName: u.universityName,
        maxGPA: u.maxGPA,
      }));

      return reply.status(200).send({
        success: true,
        data: universities,
      });
    },
  );

  // Get a specific university's grading rules
  app.get<{ Params: { id: string } }>(
    '/universities/:id',
    {
      schema: {
        description: 'Get grading rules for a specific university',
        tags: ['Universities'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'University identifier' },
          },
          required: ['id'],
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
          404: {
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
        const { id } = request.params;

        if (!hasUniversity(id)) {
          return reply.status(404).send({
            success: false,
            error: `University "${id}" not found`,
          });
        }

        const rule = getUniversityRule(id);

        return reply.status(200).send({
          success: true,
          data: rule,
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
