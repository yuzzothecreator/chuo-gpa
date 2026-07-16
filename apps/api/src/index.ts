import { buildApp } from './app.js';

const PORT = Number(process.env['PORT'] ?? 3000);
const HOST = process.env['HOST'] ?? '0.0.0.0';

async function start(): Promise<void> {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🎓 Chuo-GPA API running at http://${HOST}:${PORT}`);
    console.log(`📖 Swagger docs at http://${HOST}:${PORT}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
