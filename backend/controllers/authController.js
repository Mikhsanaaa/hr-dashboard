const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 2. Cocokkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    // 3. Buat Token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};