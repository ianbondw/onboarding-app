import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function randToken(len = 24) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function main() {
  const advisorCount = 3;
  const perAdvisorSubs = 25;

  for (let i = 0; i < advisorCount; i++) {
    const advisor = await prisma.advisor.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        token: randToken(),
      },
    });

    const subs = Array.from({ length: perAdvisorSubs }).map(() => ({
      advisorId: advisor.id,
      status: 'submitted',
      riskScore: faker.number.int({ min: 1, max: 10 }),
      income: faker.number.int({ min: 60000, max: 600000 }),
      netWorth: faker.number.int({ min: 50000, max: 5_000_000 }),
      createdAt: faker.date.recent({ days: 80 }),
    }));

    await prisma.clientSubmission.createMany({ data: subs });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Seed complete');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });