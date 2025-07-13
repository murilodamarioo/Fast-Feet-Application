/*
  Warnings:

  - Made the column `courier_id` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_courier_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "courier_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
