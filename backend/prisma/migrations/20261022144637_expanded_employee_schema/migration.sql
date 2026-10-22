/*
  Warnings:

  - Added the required column `businessTravel` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dailyRate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `distanceFromHome` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationField` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeCount` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `environmentSatisfaction` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hourlyRate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobInvolvement` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobLevel` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyRate` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numCompaniesWorked` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `over18` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentSalaryHike` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `performanceRating` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationshipSatisfaction` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `standardHours` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockOptionLevel` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalWorkingYears` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trainingTimesLastYear` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsInCurrentRole` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsSinceLastPromotion` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearsWithCurrManager` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "businessTravel" TEXT NOT NULL,
ADD COLUMN     "dailyRate" INTEGER NOT NULL,
ADD COLUMN     "distanceFromHome" INTEGER NOT NULL,
ADD COLUMN     "education" INTEGER NOT NULL,
ADD COLUMN     "educationField" TEXT NOT NULL,
ADD COLUMN     "employeeCount" INTEGER NOT NULL,
ADD COLUMN     "environmentSatisfaction" INTEGER NOT NULL,
ADD COLUMN     "hourlyRate" INTEGER NOT NULL,
ADD COLUMN     "jobInvolvement" INTEGER NOT NULL,
ADD COLUMN     "jobLevel" INTEGER NOT NULL,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "monthlyRate" INTEGER NOT NULL,
ADD COLUMN     "numCompaniesWorked" INTEGER NOT NULL,
ADD COLUMN     "over18" TEXT NOT NULL,
ADD COLUMN     "percentSalaryHike" INTEGER NOT NULL,
ADD COLUMN     "performanceRating" INTEGER NOT NULL,
ADD COLUMN     "relationshipSatisfaction" INTEGER NOT NULL,
ADD COLUMN     "standardHours" INTEGER NOT NULL,
ADD COLUMN     "stockOptionLevel" INTEGER NOT NULL,
ADD COLUMN     "totalWorkingYears" INTEGER NOT NULL,
ADD COLUMN     "trainingTimesLastYear" INTEGER NOT NULL,
ADD COLUMN     "yearsInCurrentRole" INTEGER NOT NULL,
ADD COLUMN     "yearsSinceLastPromotion" INTEGER NOT NULL,
ADD COLUMN     "yearsWithCurrManager" INTEGER NOT NULL;
