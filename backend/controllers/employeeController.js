const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mendapatkan semua data karyawan (dengan fitur pencarian & filter)
exports.getAllEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    
    // Membangun kondisi filter
    let whereClause = {};
    if (department) whereClause.department = department;
    if (search) {
      whereClause.jobRole = { contains: search, mode: 'insensitive' };
    }

    const employees = await prisma.employee.findMany({
      where: whereClause,
      take: 100, // Batasi 100 untuk performa, nanti buat pagination
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
    
    // Hitung persentase turnover
    const turnoverRate = ((attritionCount / totalEmployees) * 100).toFixed(2);

    // Data per departemen (untuk chart)
    const departments = await prisma.employee.groupBy({
      by: ['department'],
      _count: { id: true },
    });

    res.json({
      totalEmployees,
      activeEmployees,
      attritionCount,
      turnoverRate: parseFloat(turnoverRate),
      departments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};