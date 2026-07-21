import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import { gpaRoutes } from './routes/gpa.js';
import { cgpaRoutes } from './routes/cgpa.js';
import { classifyRoutes } from './routes/classify.js';
import { universityRoutes } from './routes/universities.js';
import { healthRoutes } from './routes/health.js';

function resolveCorsOrigin(): boolean | string | string[] {
  const raw = process.env['CORS_ORIGIN']?.trim();
  if (!raw || raw === '*') {
    // Default: reflect is disabled; allow common local frontends only
    return ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * Build and configure the Fastify application.
 */
export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env['LOG_LEVEL'] ?? 'info',
    },
    bodyLimit: 64 * 1024, // 64KB — calculator payloads should be small
    requestTimeout: 10_000,
  });

  await app.register(cors, {
    origin: resolveCorsOrigin(),
    methods: ['GET', 'POST'],
  });

  await app.register(rateLimit, {
    max: Number(process.env['RATE_LIMIT_MAX'] ?? 60),
    timeWindow: '1 minute',
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Chuo-GPA API',
        description:
          'The Academic Calculation Engine for Tanzanian Universities. Calculate GPA, CGPA, degree classification, and more.',
        version: '0.1.0',
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
        contact: {
          name: 'Chuo-GPA',
          url: 'https://github.com/chuo-gpa/chuo-gpa',
        },
      },
      tags: [
        { name: 'GPA', description: 'GPA calculation endpoints' },
        { name: 'CGPA', description: 'CGPA calculation endpoints' },
        { name: 'Classification', description: 'Degree classification endpoints' },
        { name: 'Universities', description: 'University information endpoints' },
        { name: 'Health', description: 'Health check endpoints' },
      ],
    },
  });

  await app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  await app.register(gpaRoutes, { prefix: '/api/v1' });
  await app.register(cgpaRoutes, { prefix: '/api/v1' });
  await app.register(classifyRoutes, { prefix: '/api/v1' });
  await app.register(universityRoutes, { prefix: '/api/v1' });
  await app.register(healthRoutes, { prefix: '/api/v1' });

  return app;
}
