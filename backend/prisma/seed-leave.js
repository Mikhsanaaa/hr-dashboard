const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const employees = await prisma.employee.findMany({ select: { id: true } });
  const leaveTypes = ['Annual', 'Sick', 'Unpaid'];
  const statuses = ['Pending', 'Approved', 'Rejected'];

  const dummyLeaves = [];

  for (let i = 0; i < 300; i++) {
    const randomEmp = employees[Math.floor(Math.random() * employees.length)];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30)); // Acak dalam 30 hari terakhir
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 3) + 1); // Durasi 1-3 hari

    dummyLeaves.push({
      employeeId: randomEmp.id,
      leaveType: leaveTypes[Math.floor(Math.random() * leaveTypes.length)],
      startDate: startDate,
      endDate: endDate,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      reason: 'Keperluan pribadi / sakit',
    });
  }

  await prisma.leaveRequest.createMany({ data: dummyLeaves });
  console.log('✅ 300 data cuti dummy berhasil dibuat!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());