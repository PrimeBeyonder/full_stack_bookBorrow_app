-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'BORROWER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'BORROWER';
