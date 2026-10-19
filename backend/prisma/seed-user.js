const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@hr.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  
  console.log('✅ Admin berhasil dibuat:', admin.email);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());