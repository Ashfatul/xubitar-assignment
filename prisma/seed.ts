import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL || "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });


async function main() {
  // Clear existing preorders
  await prisma.preorder.deleteMany({});

  const preorders = [
    {
      name: "Multi variant 3",
      products: 1,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: null,
      isActive: false,
      createdAt: new Date("2025-12-15T20:24:00"),
    },
    {
      name: "Multi variant 2",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: new Date("2025-12-15T20:27:00"),
      isActive: true,
      createdAt: new Date("2025-12-15T20:23:00"),
    },
    {
      name: "Multi variants 1",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-15T20:24:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-12-15T20:22:00"),
    },
    {
      name: "Partial payment",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-08-17T16:56:00"),
    },
    {
      name: "Shipping not sure",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-08-17T16:55:00"),
    },
    {
      name: "Full payment",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-17T16:56:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-08-17T16:54:00"),
    },
    {
      name: "Coming soon",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-12-11T04:42:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-12-11T04:42:00"),
    },
    {
      name: "With ends",
      products: 1,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-08-14T15:59:00"),
      endsAt: new Date("2025-08-20T18:00:00"),
      isActive: true,
      createdAt: new Date("2025-08-14T15:59:00"),
    },
    {
      name: "Limited edition drop",
      products: 12,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2025-09-01T09:30:00"),
      endsAt: new Date("2025-09-05T18:00:00"),
      isActive: false,
      createdAt: new Date("2025-09-01T09:30:00"),
    },
    {
      name: "Holiday batch",
      products: 6,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-11-10T08:00:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-11-10T08:00:00"),
    },
    {
      name: "Backorder window",
      products: 3,
      preorderWhen: "out-of-stock",
      startsAt: new Date("2025-10-03T13:15:00"),
      endsAt: new Date("2025-10-10T13:15:00"),
      isActive: true,
      createdAt: new Date("2025-10-03T13:15:00"),
    },
    {
      name: "Spring restock",
      products: 8,
      preorderWhen: "regardless-of-stock",
      startsAt: new Date("2025-04-18T10:00:00"),
      endsAt: null,
      isActive: true,
      createdAt: new Date("2025-04-18T10:00:00"),
    },
  ];

  for (const preorder of preorders) {
    await prisma.preorder.create({
      data: preorder,
    });
  }

  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
