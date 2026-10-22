const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mendapatkan semua data karyawan (dengan fitur pencarian & filter)
exports.getAllEmployees = async (req, res) => {
  try {
    const query = req.query;
    let whereClause = {};

    for (const key in query) {
      if (query[key]) {
        if (key === 'search') {
          // Pencarian sekarang berdasarkan Employee Number (ID)
          whereClause.employeeNumber = parseInt(query.search); 
        }
        else if (key === 'ageMin') whereClause.age = { ...whereClause.age, gte: parseInt(query[key]) };
        else if (key === 'ageMax') whereClause.age = { ...whereClause.age, lte: parseInt(query[key]) };
        else if (key === 'incomeMin') whereClause.monthlyIncome = { ...whereClause.monthlyIncome, gte: parseInt(query[key]) };
        else if (key === 'incomeMax') whereClause.monthlyIncome = { ...whereClause.monthlyIncome, lte: parseInt(query[key]) };
        else if (['attrition', 'businessTravel', 'department', 'educationField', 'gender', 'jobRole', 'maritalStatus', 'overTime'].includes(key)) {
          whereClause[key] = query[key]; 
        }
      }
    }

    const employees = await prisma.employee.findMany({
      where: whereClause,
      take: 2000,
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data statistik untuk Dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    const attritionCount = await prisma.employee.count({ where: { attrition: 'Yes' } });
    const activeEmployees = totalEmployees - attritionCount;
    const turnoverRate = ((attritionCount / totalEmployees) * 100).toFixed(2);

    // Data per departemen
    const departments = await prisma.employee.groupBy({
      by: ['department'],
      _count: { id: true },
    });

    // Data per Gender
    const genderStats = await prisma.employee.groupBy({
      by: ['gender'],
      _count: { id: true },
    });

    // Data OverTime
    const overTimeStats = await prisma.employee.groupBy({
      by: ['overTime'],
      _count: { id: true },
    });

    res.json({
      totalEmployees,
      activeEmployees,
      attritionCount,
      turnoverRate: parseFloat(turnoverRate),
      departments,
      genderStats,
      overTimeStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLeaveStats = async (req, res) => {
  try {
    const totalRequests = await prisma.leaveRequest.count();
    const pendingRequests = await prisma.leaveRequest.count({ where: { status: 'Pending' } });
    
    // Statistik per tipe cuti
    const leaveTypes = await prisma.leaveRequest.groupBy({
      by: ['leaveType'],
      _count: { id: true },
    });

    // Daftar 5 cuti terbaru yang butuh persetujuan (Pending)
    const recentPending = await prisma.leaveRequest.findMany({
      where: { status: 'Pending' },
      take: 5,
      include: { employee: { select: { jobRole: true, department: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ totalRequests, pendingRequests, leaveTypes, recentPending });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fungsi untuk statistik kompensasi
exports.getCompensationStats = async (req, res) => {
  try {
    // 1. Hitung Total Beban Gaji (MonthlyIncome)
    const totalSalary = await prisma.employee.aggregate({
      _sum: { monthlyIncome: true },
      _avg: { monthlyIncome: true },
    });

    // 2. Hitung Gaji per Departemen
    const salaryPerDept = await prisma.employee.groupBy({
      by: ['department'],
      _sum: { monthlyIncome: true },
      _avg: { monthlyIncome: true },
    });

    // 3. Hitung Jumlah Karyawan Lembur (Untuk simulasi biaya lembur)
    const overTimeCount = await prisma.employee.count({
      where: { overTime: 'Yes' }
    });

    // Simulasi: Anggap biaya lembur adalah 15% dari gaji karyawan yang lembur
    // (Kita asumsikan rata-rata gaji karyawan lembur sama dengan rata-rata gaji keseluruhan)
    const avgSalary = salaryPerDept.reduce((acc, curr) => acc + curr._avg.monthlyIncome, 0) / salaryPerDept.length;
    const estimatedOverTimeCost = overTimeCount * (avgSalary * 0.15);

    res.json({
      totalSalary: totalSalary._sum.monthlyIncome,
      averageSalary: totalSalary._avg.monthlyIncome,
      salaryPerDept,
      overTimeCount,
      estimatedOverTimeCost
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};