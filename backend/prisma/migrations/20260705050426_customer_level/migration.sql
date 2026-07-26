-- CreateEnum
CREATE TYPE "customerLevel" AS ENUM ('VIP', 'REGULAR', 'NEW');

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "Status" "customerLevel" NOT NULL DEFAULT 'NEW';
