-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "delivered_at" TIMESTAMP(3),
ADD COLUMN     "picked_up" TIMESTAMP(3),
ADD COLUMN     "posted_at" TIMESTAMP(3);
