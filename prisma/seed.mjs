import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

function randToken(len = 24) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function main() {
  const ownerEmail = (process.env.ADMIN_EMAIL || "owner@local").toLowerCase();
  const ownerPassword = process.env.ADMIN_PASS || "changeme123!";

  await prisma.portalUser.upsert({
    where: { email: ownerEmail },
    update: {
      passwordHash: hashPassword(ownerPassword),
      role: "owner",
      isActive: true,
    },
    create: {
      email: ownerEmail,
      passwordHash: hashPassword(ownerPassword),
      role: "owner",
      isActive: true,
    },
  });

  await prisma.portalUser.upsert({
    where: { email: "ops@local" },
    update: {
      passwordHash: hashPassword("OpsDemo123!"),
      role: "ops",
      advisorId: null,
      isActive: true,
    },
    create: {
      email: "ops@local",
      passwordHash: hashPassword("OpsDemo123!"),
      role: "ops",
      advisorId: null,
      isActive: true,
    },
  });

  for (let i = 0; i < 3; i++) {
    const advisor = await prisma.advisor.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        firm: faker.company.name(),
        slug: `${faker.word.adjective()}-${faker.word.noun()}-${faker.string.alphanumeric(6)}`.toLowerCase(),
      },
      select: { id: true, name: true, firm: true, email: true },
    });

    await prisma.portalUser.create({
      data: {
        email: advisor.email,
        passwordHash: hashPassword("AdvisorDemo123!"),
        role: "advisor",
        advisorId: advisor.id,
        isActive: true,
      },
    });

    const intake = await prisma.intakeLink.create({
      data: {
        advisorId: advisor.id,
        token: randToken(),
        isActive: true,
      },
      select: { token: true },
    });

    for (let j = 0; j < 10; j++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();

      await prisma.client.create({
        data: {
          advisorId: advisor.id,
          advisorName: advisor.name,
          advisorFirm: advisor.firm,
          intakeToken: j === 0 ? intake.token : null,
          firstName,
          lastName,
          email,
          phone: faker.phone.number(),
          annualIncomeBand: faker.helpers.arrayElement(["50-100k", "100-250k", "250-500k"]),
          riskTolerance: faker.helpers.arrayElement(["conservative", "moderate", "growth"]),
          timeHorizon: faker.helpers.arrayElement(["3-5y", "5-10y", "10+y"]),
          primaryGoals: faker.helpers.arrayElements(
            ["retirement", "income", "education", "growth"],
            { min: 1, max: 2 }
          ),
          onboardingProgress: faker.number.int({ min: 30, max: 100 }),
          onboardingStatus: faker.helpers.arrayElement(["in_progress", "verified", "declined"]),
          identityVerificationStatus: faker.helpers.arrayElement(["pending", "in_review", "verified"]),
          documentVerificationStatus: faker.helpers.arrayElement(["pending", "in_review", "verified"]),
          concernsNarrative: faker.lorem.sentence(),
        },
      });
    }

    await prisma.trialLead.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        firm: advisor.firm,
        source: "seed",
        status: faker.helpers.arrayElement(["new", "activated"]),
        advisorId: advisor.id,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed complete");
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
