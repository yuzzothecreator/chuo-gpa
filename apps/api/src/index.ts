import { buildApp } from './app.js';

const PORT = Number(process.env['PORT'] ?? 3000);
// Default to localhost for safer local runs; set HOST=0.0.0.0 in production behind a proxy
const HOST = process.env['HOST'] ?? '127.0.0.1';

async function start(): Promise<void> {
  if (!Number.isFinite(PORT) || PORT <= 0 || PORT > 65535) {
    console.error('Invalid PORT environment variable');
    process.exit(1);
  }

  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`Chuo-GPA API running at http://${HOST}:${PORT}`);
    console.log(`Swagger docs at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
