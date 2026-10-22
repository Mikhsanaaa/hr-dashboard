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