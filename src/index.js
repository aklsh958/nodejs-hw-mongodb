import 'dotenv/config.js';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

async function bootstrap() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('❌ Error starting server:', error.message);
    process.exit(1);
  }
}

bootstrap();
