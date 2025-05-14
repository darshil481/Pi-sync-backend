import { PrismaClient } from '@prisma/client';
import { ERROR_MESSAGES } from '../constants';
const prisma = new PrismaClient();

async function seedErrorLogs() {
  const devices = await prisma.device.findMany(); 

  if (devices.length === 0) {
    console.log('No devices found to associate errors with.');
    return;
  }



  const errorLogs = devices.map(device => {
    return {
      deviceId: device.deviceId, 
      message: ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 10)), 
    };
  });
for (const element of errorLogs) {
  await prisma.syncError.create({
    data: {
      message: element.message,
      timestamp: element.timestamp,
      device: {
        connect: {
          deviceId: element.deviceId, 
        },
      },
    },
  });
}


  console.log('Seeded error logs successfully.');
}

seedErrorLogs()
  .catch((error) => {
    console.error('Error seeding sync error logs:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
