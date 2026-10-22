const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const results = [];
  const csvFilePath = path.join(__dirname, '../../data/raw/WA_Fn-UseC_-HR-Employee-Attrition.csv');
  
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const cleanData = {};
      for (let key in data) cleanData[key.trim()] = data[key];

      results.push({
        age: parseInt(cleanData['Age']),
        attrition: cleanData['Attrition'],
        businessTravel: cleanData['BusinessTravel'],
        dailyRate: parseInt(cleanData['DailyRate']),
        department: cleanData['Department'],
        distanceFromHome: parseInt(cleanData['DistanceFromHome']),
        education: parseInt(cleanData['Education']),
        educationField: cleanData['EducationField'],
        employeeCount: parseInt(cleanData['EmployeeCount']),
        employeeNumber: parseInt(cleanData['EmployeeNumber']),
        environmentSatisfaction: parseInt(cleanData['EnvironmentSatisfaction']),
        gender: cleanData['Gender'],
        hourlyRate: parseInt(cleanData['HourlyRate']),
        jobInvolvement: parseInt(cleanData['JobInvolvement']),
        jobLevel: parseInt(cleanData['JobLevel']),
        jobRole: cleanData['JobRole'],
        jobSatisfaction: parseInt(cleanData['JobSatisfaction']),
        maritalStatus: cleanData['MaritalStatus'],
        monthlyIncome: parseInt(cleanData['MonthlyIncome']),
        monthlyRate: parseInt(cleanData['MonthlyRate']),
        numCompaniesWorked: parseInt(cleanData['NumCompaniesWorked']),
        over18: cleanData['Over18'],
        overTime: cleanData['OverTime'],
        percentSalaryHike: parseInt(cleanData['PercentSalaryHike']),
        performanceRating: parseInt(cleanData['PerformanceRating']),
        relationshipSatisfaction: parseInt(cleanData['RelationshipSatisfaction']),
        standardHours: parseInt(cleanData['StandardHours']),
        stockOptionLevel: parseInt(cleanData['StockOptionLevel']),
        totalWorkingYears: parseInt(cleanData['TotalWorkingYears']),
        trainingTimesLastYear: parseInt(cleanData['TrainingTimesLastYear']),
        workLifeBalance: parseInt(cleanData['WorkLifeBalance']),
        yearsAtCompany: parseInt(cleanData['YearsAtCompany']),
        yearsInCurrentRole: parseInt(cleanData['YearsInCurrentRole']),
        yearsSinceLastPromotion: parseInt(cleanData['YearsSinceLastPromotion']),
        yearsWithCurrManager: parseInt(cleanData['YearsWithCurrManager']),
      });
    })
    .on('end', async () => {
      await prisma.employee.createMany({ data: results });
      console.log(`✅ Sukses! ${results.length} data karyawan (35 kolom) berhasil dimasukkan.`);
      await prisma.$disconnect();
    });
}

main();