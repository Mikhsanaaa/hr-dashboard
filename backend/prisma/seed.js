const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const results = [];
  
  const csvFilePath = path.join(__dirname, '../../data/raw/WA_Fn-UseC_-HR-Employee-Attrition.csv');

  console.log('Membaca file CSV dari:', csvFilePath);
  
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      // Tampilkan log untuk baris pertama agar kita tahu nama kolom aslinya
      if (results.length === 0) {
        console.log('Contoh data baris pertama:', data);
      }

      // Menggunakan pengaman || 0 jika data kosong/undefined
      results.push({
        employeeNumber: parseInt(data.EmployeeNumber) || 0,
        age: parseInt(data.Age) || 0,
        gender: data.Gender || 'Unknown',
        department: data.Department || 'Unknown',
        jobRole: data.JobRole || 'Unknown',
        monthlyIncome: parseInt(data.MonthlyIncome) || 0,
        overTime: data.OverTime || 'No',
        attrition: data.Attrition || 'No',
        yearsAtCompany: parseInt(data.YearsAtCompany) || 0,
        jobSatisfaction: parseInt(data.JobSatisfaction) || 0,
        workLifeBalance: parseInt(data.WorkLifeBalance) || 0,
      });
    })
    .on('end', async () => {
      console.log(`Selesai membaca ${results.length} baris data.`);
      console.log('Memasukkan data ke database PostgreSQL...');
      
      try {
        const createdRecords = await prisma.employee.createMany({
          data: results,
          skipDuplicates: true,
        });
        
        console.log(`✅ Sukses! ${createdRecords.count} data karyawan berhasil dimasukkan ke database.`);
      } catch (error) {
        console.error('❌ Gagal memasukkan data:', error);
      } finally {
        await prisma.$disconnect();
      }
    });
}

main();