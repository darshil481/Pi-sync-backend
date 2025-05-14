import { PrismaClient, SyncStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDevices() {
  const statuses: SyncStatus[] = ['Success', 'Pending', 'Failed'];

  const devices = Array.from({ length: 20 }, (_, index) => ({
    deviceId: `device-${index + 1}`,
    lastSync: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)),
    syncStatus: statuses[Math.floor(Math.random() * statuses.length)],
  }));

  await prisma.device.createMany({
    data: devices,
    skipDuplicates: true,
  });

  console.log('Seeded 20 dummy devices successfully.');
}

seedDevices()
  .catch((error) => {
    console.error('Error seeding devices:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
