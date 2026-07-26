/*
  Warnings:

  - You are about to drop the column `title` on the `Promotion` table. All the data in the column will be lost.
  - Added the required column `highlightedWord` to the `Promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titlePrefix` to the `Promotion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Promotion" DROP COLUMN "title",
ADD COLUMN     "highlightedWord" TEXT NOT NULL,
ADD COLUMN     "titlePrefix" TEXT NOT NULL;
