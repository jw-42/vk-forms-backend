/*
  Warnings:

  - You are about to drop the column `fisinsed` on the `AnswersGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnswersGroup" DROP COLUMN "fisinsed",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false;
