/*
  Warnings:

  - You are about to drop the column `Status` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "Status",
ADD COLUMN     "status" "customerLevel" NOT NULL DEFAULT 'NEW';
