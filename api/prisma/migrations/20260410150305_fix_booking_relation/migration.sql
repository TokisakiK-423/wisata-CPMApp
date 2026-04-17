/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Booking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Galeri` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wisata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_wisataId_fkey";

-- DropForeignKey
ALTER TABLE "Galeri" DROP CONSTRAINT "Galeri_wisataId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_wisataId_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Booking";

-- DropTable
DROP TABLE "Galeri";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Wisata";

-- DropEnum
DROP TYPE "BookingStatus";

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "telp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wisatas" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "jamBuka" TEXT NOT NULL,
    "hargaTiket" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "telepon" TEXT,

    CONSTRAINT "wisatas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeris" (
    "id" SERIAL NOT NULL,
    "wisataId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "galeris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "wisataId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "nama" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "komentar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" SERIAL NOT NULL,
    "wisataId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "nama" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "jumlahTiket" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "customers_username_key" ON "customers"("username");

-- AddForeignKey
ALTER TABLE "galeris" ADD CONSTRAINT "galeris_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "wisatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "wisatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_wisataId_fkey" FOREIGN KEY ("wisataId") REFERENCES "wisatas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
