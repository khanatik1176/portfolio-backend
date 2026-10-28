import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient, SectionType } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_UNPOOLED! }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');

  // Only creates the admin; re-running never overwrites an existing password.
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 12), name: 'Admin' },
  });

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: 'Khan Atik Faisal',
      ownerName: 'Khan Atik Faisal',
      headline: 'Full-Stack Developer',
      bio: 'I build fast, polished web apps with Next.js and NestJS.',
      socials: [{ platform: 'github', url: 'https://github.com/' }],
    },
  });

  // Starter sections, only if the site has none yet.
  if ((await prisma.section.count()) > 0) return;

  await prisma.section.create({
    data: {
      slug: 'hero',
      type: SectionType.HERO,
      title: 'Hi, I build things for the web',
      subtitle: 'Full-stack developer focused on clean, animated interfaces.',
      content: { ctaLabel: 'View my work', ctaHref: '#projects' },
      order: 0,
    },
  });
  await prisma.section.create({
    data: {
      slug: 'about',
      type: SectionType.ABOUT,
      title: 'About me',
      content: { body: 'Write a short story about yourself from the admin panel.' },
      order: 1,
    },
  });
  await prisma.section.create({
    data: {
      slug: 'skills',
      type: SectionType.SKILLS,
      title: 'Skills',
      order: 2,
      items: {
        create: ['Next.js', 'TypeScript', 'NestJS', 'PostgreSQL', 'Tailwind CSS'].map(
          (title, order) => ({ title, order }),
        ),
      },
    },
  });
  await prisma.section.create({
    data: {
      slug: 'projects',
      type: SectionType.PROJECTS,
      title: 'Projects',
      subtitle: 'Some things I have built',
      order: 3,
      items: {
        create: [
          {
            title: 'Portfolio CMS',
            description: 'This site: Next.js frontend with a NestJS + Postgres admin backend.',
            tags: ['Next.js', 'NestJS', 'Prisma'],
            order: 0,
          },
        ],
      },
    },
  });
  await prisma.section.create({
    data: {
      slug: 'contact',
      type: SectionType.CONTACT,
      title: 'Get in touch',
      subtitle: 'Have a project in mind? Send me a message.',
      order: 4,
    },
  });
}

main()
  .then(() => console.log('Seed complete'))
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
