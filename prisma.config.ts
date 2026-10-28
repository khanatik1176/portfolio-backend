import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Prisma CLI (migrate, studio) needs a direct connection; the app uses the pooled DATABASE_URL.
    url: env('DATABASE_URL_UNPOOLED'),
  },
});
