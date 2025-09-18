const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.note.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const password = await bcrypt.hash('password', 10);

  const acme = await prisma.tenant.create({
    data: {
      name: 'Acme',
      slug: 'acme',
      plan: 'FREE',
      users: {
        create: [
          { email: 'admin@acme.test', password, role: 'ADMIN' },
          { email: 'user@acme.test', password, role: 'MEMBER' }
        ]
      }
    }
  });

  const globex = await prisma.tenant.create({
    data: {
      name: 'Globex',
      slug: 'globex',
      plan: 'FREE',
      users: {
        create: [
          { email: 'admin@globex.test', password, role: 'ADMIN' },
          { email: 'user@globex.test', password, role: 'MEMBER' }
        ]
      }
    }
  });

  console.log('Seeded tenants: ', acme.slug, globex.slug);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
