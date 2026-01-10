/*
  Warnings:

  - Added the required column `role` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT', 'PARENT');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "UserRole" NOT NULL;
