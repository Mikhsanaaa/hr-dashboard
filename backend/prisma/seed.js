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
      // Membersihkan nama key (menghapus spasi tersembunyi jika ada)
      const cleanData = {};
      for (let key in data) {
        cleanData[key.trim()] = data[key];
      }

      results.push({
        employeeNumber: parseInt(cleanData['EmployeeNumber']) || 0,
        age: parseInt(cleanData['Age']) || 0, // Sekarang akan membaca 'Age'
        gender: cleanData['Gender'] || 'Unknown',
        department: cleanData['Department'] || 'Unknown',
        jobRole: cleanData['JobRole'] || 'Unknown',
        monthlyIncome: parseInt(cleanData['MonthlyIncome']) || 0,
        overTime: cleanData['OverTime'] || 'No',
        attrition: cleanData['Attrition'] || 'No',
        yearsAtCompany: parseInt(cleanData['YearsAtCompany']) || 0,
        jobSatisfaction: parseInt(cleanData['JobSatisfaction']) || 0,
        workLifeBalance: parseInt(cleanData['WorkLifeBalance']) || 0,
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