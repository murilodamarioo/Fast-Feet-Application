/*
  Warnings:

  - You are about to drop the column `picked_up` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "picked_up",
ADD COLUMN     "picked_up_at" TIMESTAMP(3);
