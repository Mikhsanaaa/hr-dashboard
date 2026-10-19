-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employeeNumber" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "monthlyIncome" INTEGER NOT NULL,
    "overTime" TEXT NOT NULL,
    "attrition" TEXT NOT NULL,
    "yearsAtCompany" INTEGER NOT NULL,
    "jobSatisfaction" INTEGER NOT NULL,
    "workLifeBalance" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeNumber_key" ON "Employee"("employeeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
