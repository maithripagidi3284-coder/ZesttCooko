-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'CHEF', 'ADMIN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AvailabilityMode" AS ENUM ('PART_TIME', 'FULL_TIME');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('SEARCHING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'FAILED_NO_CHEFS');

-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('INSTANT', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('KITTY_PARTY', 'BIRTHDAY', 'PRIVATE_EVENT', 'FAMILY_GATHERING', 'OFFICE_PARTY', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT,
    "profilePicUrl" TEXT,
    "role" "Role" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "idProofUrl" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChefProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cuisineSpecialties" TEXT[],
    "signatureDishes" TEXT[],
    "hourlyRate" DOUBLE PRECISION NOT NULL,
    "age" INTEGER,
    "availabilityMode" "AvailabilityMode" NOT NULL DEFAULT 'PART_TIME',
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "travelRadiusKm" INTEGER NOT NULL DEFAULT 5,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChefProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedChefId" TEXT NOT NULL,
    "chefId" TEXT,
    "assistantChefId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'SEARCHING',
    "bookingType" "BookingType" NOT NULL DEFAULT 'SCHEDULED',
    "eventType" "EventType" NOT NULL DEFAULT 'OTHER',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "hours" INTEGER NOT NULL,
    "headcount" INTEGER NOT NULL,
    "selectedDishes" TEXT[],
    "customRequest" TEXT,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "platformFee" DOUBLE PRECISION NOT NULL,
    "chefPayout" DOUBLE PRECISION NOT NULL,
    "assistantPayout" DOUBLE PRECISION,
    "hasComplaint" BOOLEAN NOT NULL DEFAULT false,
    "complaintText" TEXT,
    "rating" INTEGER,
    "reviewText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingOffer" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "chefId" TEXT NOT NULL,
    "status" "OfferStatus" NOT NULL DEFAULT 'PENDING',
    "offeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "BookingOffer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_whatsapp_key" ON "User"("whatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "ChefProfile_userId_key" ON "ChefProfile"("userId");

-- AddForeignKey
ALTER TABLE "ChefProfile" ADD CONSTRAINT "ChefProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingOffer" ADD CONSTRAINT "BookingOffer_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
